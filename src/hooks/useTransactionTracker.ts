import { useEffect } from 'react';
import { useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useTransactionTracker(
  hash: `0x${string}` | undefined,
  recipient: string,
  amount: string,
  token: string
) {
  const { address, chain } = useAccount();
  const { data: receipt, isSuccess, isError } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && receipt && address && hash) {
      const saveTransaction = async () => {
        try {
          const gasUsed = receipt.gasUsed || BigInt(0);
          const effectiveGasPrice = receipt.effectiveGasPrice || BigInt(0);
          const gasFee = (gasUsed * effectiveGasPrice).toString();

          const { error } = await supabase.from('transactions').insert({
            user_address: address.toLowerCase(),
            transaction_hash: hash,
            from_address: receipt.from.toLowerCase(),
            to_address: recipient.toLowerCase(),
            amount: parseFloat(amount),
            token: token,
            chain_id: chain?.id || 1,
            chain_name: chain?.name || 'Unknown',
            status: receipt.status === 'success' ? 'success' : 'failed',
            gas_fee: parseFloat(gasFee),
            block_number: Number(receipt.blockNumber),
          });

          if (error) {
            console.error('Error saving transaction:', error);
          } else {
            // Update recipients table
            const { error: recipientError } = await supabase
              .from('recipients')
              .upsert(
                {
                  user_address: address.toLowerCase(),
                  recipient_address: recipient.toLowerCase(),
                  last_transaction_at: new Date().toISOString(),
                },
                {
                  onConflict: 'user_address,recipient_address',
                }
              );

            if (recipientError) {
              console.error('Error updating recipient:', recipientError);
            }

            toast({
              title: "Transaction Saved",
              description: "Your transaction has been recorded.",
            });
          }
        } catch (error) {
          console.error('Error in saveTransaction:', error);
        }
      };

      saveTransaction();
    }

    if (isError && hash) {
      const saveFailedTransaction = async () => {
        if (!address || !chain) return;
        
        try {
          await supabase.from('transactions').insert({
            user_address: address.toLowerCase(),
            transaction_hash: hash,
            from_address: address.toLowerCase(),
            to_address: recipient.toLowerCase(),
            amount: parseFloat(amount),
            token: token,
            chain_id: chain.id,
            chain_name: chain.name,
            status: 'failed',
            gas_fee: 0,
            block_number: 0,
          });
        } catch (error) {
          console.error('Error saving failed transaction:', error);
        }
      };

      saveFailedTransaction();
    }
  }, [isSuccess, isError, receipt, address, hash, chain, recipient, amount, token]);
}