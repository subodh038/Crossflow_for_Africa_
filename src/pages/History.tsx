import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useUserTransactions } from "@/hooks/useUserTransactions";

const History = () => {
  const { isConnected, chain, address } = useAccount();
  const { transactions, loading } = useUserTransactions();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getBlockExplorerUrl = (hash: string) => {
    return `${chain?.blockExplorers?.default?.url}/tx/${hash}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view transaction history
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
                Transaction History
              </h1>
              <p className="text-muted-foreground mt-2">
                View all your past transactions on {chain?.name}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your transaction history across all supported networks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">Loading transactions...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-center">
                      <div>
                        <p className="text-muted-foreground mb-4">
                          No transactions found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Once you make your first transaction, it will appear here
                        </p>
                      </div>
                    </div>
                  ) : (
                    transactions.map((tx) => (
                      <Card key={tx.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">
                                  {tx.from_address.toLowerCase() === address?.toLowerCase() ? 'Sent' : 'Received'} {tx.amount} {tx.token}
                                </p>
                                <Badge variant={tx.status === 'success' ? 'default' : tx.status === 'failed' ? 'destructive' : 'secondary'}>
                                  {tx.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                From: {truncateAddress(tx.from_address)} → To: {truncateAddress(tx.to_address)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(tx.timestamp).toLocaleString()} • {tx.chain_name}
                              </p>
                            </div>
                            <a
                              href={getBlockExplorerUrl(tx.transaction_hash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Example transaction structure (commented out) */}
            {/* 
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Sent USDC</p>
                      <p className="text-sm text-muted-foreground">To 0x1234...5678</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">-100.00 USDC</p>
                    <Badge variant="outline" className="mt-1">
                      Success
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            */}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default History;
