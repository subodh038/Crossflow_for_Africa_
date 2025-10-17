import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAccount } from 'wagmi';

export function useUserTransactions() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    const fetchTransactions = async () => {
      const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .or(`from_address.eq.${address.toLowerCase()},to_address.eq.${address.toLowerCase()}`)
  .order('timestamp', { ascending: false });

      if (error) console.error('Error fetching transactions:', error);
      else setTransactions(data || []);
      setLoading(false);
    };

    fetchTransactions();

    // Realtime listener
    const channel = supabase
      .channel('transactions-change')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          console.log('Realtime payload received:', payload);
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [address]);

  return { transactions, loading };
}
