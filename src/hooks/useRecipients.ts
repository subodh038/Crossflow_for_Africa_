import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

export interface Recipient {
  id: string;
  user_address: string;
  recipient_address: string;
  nickname: string | null;
  transaction_count: number;
  last_transaction_at: string;
  created_at: string;
}

export function useRecipients() {
  const { address } = useAccount();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 1️⃣ Move fetchRecipients OUTSIDE useEffect so we can call it later too
  const fetchRecipients = async () => {
    if (!address) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('recipients')
      .select('*')
      .eq('user_address', address.toLowerCase())
      .order('last_transaction_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching recipients:', error);
    } else {
      setRecipients(data || []);
    }

    setLoading(false);
  };

  // ✅ 2️⃣ Only trigger initial load from useEffect
  useEffect(() => {
    if (address) {
      fetchRecipients();
    } else {
      setRecipients([]);
      setLoading(false);
    }
  }, [address]);

  // ✅ 3️⃣ Now call fetchRecipients again after adding a new recipient
  const addRecipient = async (recipientAddress: string, nickname?: string) => {
    if (!address) return;

    const { error } = await supabase.from('recipients').upsert(
      {
        user_address: address.toLowerCase(),
        recipient_address: recipientAddress.toLowerCase(),
        nickname: nickname || null,
        last_transaction_at: new Date().toISOString(),
      },
      { onConflict: 'user_address,recipient_address' }
    );

    if (error) {
      console.error('Error adding recipient:', error);
      alert('Failed to add recipient: ' + error.message);
    } else {
      await fetchRecipients(); // 🧠 refresh list after successful insert
    }
  };

  const removeRecipient = async (recipientId: string) => {
    const { error } = await supabase
      .from('recipients')
      .delete()
      .eq('id', recipientId);

    if (error) {
      console.error('Error removing recipient:', error);
      throw error;
    }

    setRecipients((prev) => prev.filter((r) => r.id !== recipientId));
  };

  return { recipients, loading, addRecipient, removeRecipient };
}
