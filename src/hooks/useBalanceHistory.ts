import { useMemo } from 'react';
import { useBalance } from 'wagmi';
import { formatEther } from 'viem';

interface BalanceData {
  day: string;
  value: number;
}

export function useBalanceHistory(address: `0x${string}` | undefined) {
  const { data: balance } = useBalance({ address });

  const balanceData = useMemo<BalanceData[]>(() => {
    if (!balance) {
      return [
        { day: 'Mon', value: 0 },
        { day: 'Tue', value: 0 },
        { day: 'Wed', value: 0 },
        { day: 'Thu', value: 0 },
        { day: 'Fri', value: 0 },
        { day: 'Sat', value: 0 },
        { day: 'Sun', value: 0 },
      ];
    }

    const currentValue = parseFloat(formatEther(balance.value));
    
    // Generate mock historical data based on current balance
    // In a real app, you'd fetch this from a backend service
    return [
      { day: 'Mon', value: currentValue * 0.8 },
      { day: 'Tue', value: currentValue * 0.85 },
      { day: 'Wed', value: currentValue * 0.82 },
      { day: 'Thu', value: currentValue * 0.91 },
      { day: 'Fri', value: currentValue * 0.97 },
      { day: 'Sat', value: currentValue * 0.95 },
      { day: 'Sun', value: currentValue },
    ];
  }, [balance]);

  const currentBalance = balance ? parseFloat(formatEther(balance.value)) : 0;
  const previousBalance = balanceData[0]?.value || 0;
  const balanceChange = previousBalance > 0 
    ? ((currentBalance - previousBalance) / previousBalance) * 100 
    : 0;

  return {
    balanceData,
    currentBalance,
    balanceChange: balanceChange.toFixed(1),
    changeAmount: (currentBalance - previousBalance).toFixed(2),
  };
}
