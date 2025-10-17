import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useUserTransactions } from "@/hooks/useUserTransactions";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { BarChart, Bar,} from "recharts";


const Analytics = () => {
  const { isConnected, address } = useAccount();
  const { transactions, loading } = useUserTransactions();

  const stats = useMemo(() => {
    const totalTransactions = transactions.length;
    
    const sent = transactions
  .filter(tx => tx.from_address.toLowerCase() === address?.toLowerCase())
  .reduce((sum, tx) => sum + Number(tx.amount), 0);

const received = transactions
  .filter(tx => tx.to_address.toLowerCase() === address?.toLowerCase())
  .reduce((sum, tx) => sum + Number(tx.amount), 0);

    
    const avgGasFee = transactions.length > 0
  ? transactions.reduce((sum, tx) => sum + (Number(tx.gas_fee) || 0), 0) / transactions.length / 1e18
  : 0;


    return {
      totalTransactions,
      totalSent: sent.toFixed(2),
      totalReceived: received.toFixed(2),
      avgGasFee: avgGasFee.toFixed(4),
    };
  }, [transactions, address]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="ml-20">
        <Header />
        <div className="min-h-screen bg-background">
          <div className="flex-1 pt-24 px-8">
            <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Analytics
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your transaction patterns and portfolio performance
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.totalTransactions}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : `$${stats.totalSent}`}</div>
                  <p className="text-xs text-muted-foreground">USD equivalent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Received</CardTitle>
                  <TrendingDown className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : `$${stats.totalReceived}`}</div>
                  <p className="text-xs text-muted-foreground">USD equivalent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Gas Fee</CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : `$${stats.avgGasFee}`}</div>
                  <p className="text-xs text-muted-foreground">Per transaction</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Your activity over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
  {transactions.length === 0 ? (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      No transaction data available yet
    </div>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={transactions}>
        <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleDateString()} />
        <YAxis />
        <Tooltip
          labelFormatter={(ts) => new Date(ts).toLocaleString()}
          formatter={(value) => [`${value}`, "Amount"]}
        />
        <Bar dataKey="amount" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )}
</CardContent>

            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Distribution</CardTitle>
                <CardDescription>Transaction count by network</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
  {transactions.length === 0 ? (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      No transaction data available yet
    </div>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={transactions.slice(0, 30).reverse()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(t) => new Date(t).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#4F46E5"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )}
</CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Analytics;
