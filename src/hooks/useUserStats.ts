import { useMemo } from 'react';
import { useBalance } from 'wagmi';
import { useUserTransactions } from './useUserTransactions';
import { useRecipients } from './useRecipients';
import { formatEther } from 'viem';

export function useUserStats(address: `0x${string}` | undefined) {
  const { transactions } = useUserTransactions();
  const { recipients } = useRecipients();
  const { data: balance } = useBalance({ address });

  const stats = useMemo(() => {
    if (!address) {
      return {
        balance: '0.00',
        transferCount: 0,
        recipientCount: 0,
        balanceChange: '+0.0%',
        transferChange: '+0.0%',
        recipientChange: '+0.0%',
      };
    }

    const totalTransfers = transactions.length;
    const totalRecipients = recipients.length;

    // Calculate balance from actual wallet
    const currentBalance = balance ? formatEther(balance.value) : '0';
    const formattedBalance = parseFloat(currentBalance).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Calculate changes (mock for now - could track historical data)
    const balanceChange = '+12.5%';
    const transferChange = transactions.length > 0 ? '+24.5%' : '+0.0%';
    const recipientChange = recipients.length > 0 ? '+8.2%' : '+0.0%';

    return {
      balance: formattedBalance,
      transferCount: totalTransfers,
      recipientCount: totalRecipients,
      balanceChange,
      transferChange,
      recipientChange,
    };
  }, [address, transactions, recipients, balance]);

  return stats;
}