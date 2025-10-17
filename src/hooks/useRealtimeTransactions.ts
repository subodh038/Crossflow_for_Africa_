import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { supabase } from '@/integrations/supabase/client'

export function useRealtimeTransactions() {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!address) return

    const fetchTransactions = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_address', address.toLowerCase())
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
      } else {
        setTransactions(data || [])
      }
      setLoading(false)
    }

    fetchTransactions()

    // Realtime subscription
    const channel = supabase
      .channel('realtime-transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_address=eq.${address.toLowerCase()}`
        },
        (payload) => {
          console.log('Realtime update:', payload)
          fetchTransactions()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [address])

  return { transactions, loading }
}
