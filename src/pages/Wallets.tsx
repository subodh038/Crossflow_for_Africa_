import { useAccount, useBalance, useDisconnect, useSwitchChain } from "wagmi";
import { base, celo, mainnet, sepolia, celoAlfajores } from "wagmi/chains";
import { pushChain, somniaTestnet, celoSepoliaTestnet } from "@/config/wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const Wallets = () => {
  const { address, chain, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  
  // Get ETH balance on current chain
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // USDT on Base
  const { data: usdtBase } = useBalance({
    address: address,
    token: "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    chainId: base.id,
  });

  // USDC on Base
  const { data: usdcBase } = useBalance({
    address: address,
    token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
    chainId: base.id,
  });

  // cUSD on Celo
  const { data: cUSD } = useBalance({
    address: address,
    token: "0x765DE816845861e75A25fCA122bb6898B8B1282a", // cUSD
    chainId: celo.id,
  });

  // PC on Push Chain
  const { data: pcBalance } = useBalance({
    address: address,
    chainId: pushChain.id,
  });

  // ETH on Sepolia
  const { data: sepoliaBalance } = useBalance({
    address: address,
    chainId: sepolia.id,
  });

  // STT on Somnia Testnet
  const { data: somniaBalance } = useBalance({
    address: address,
    chainId: somniaTestnet.id,
  });

  // cUSD on Celo Alfajores
  const { data: celoAlfajoresBalance } = useBalance({
    address: address,
    token: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
    chainId: celoAlfajores.id,
  });

  // CELO on Celo Sepolia Testnet
  const { data: celoSepoliaBalance } = useBalance({
    address: address,
    chainId: celoSepoliaTestnet.id,
  });

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Success",
        description: "Address copied to clipboard",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view balances and manage your assets across Base, Celo, Push Chain, and Ethereum
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Wallet Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  View and manage your multi-chain assets
                </p>
              </div>
              <Button variant="outline" onClick={() => disconnect()}>
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>

            {/* Wallet Info Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Connected Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                    <p className="font-mono text-sm">{address}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Current Network</p>
                  <Badge variant="secondary" className="text-sm">
                    {chain?.name || "Unknown"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Chain Balances */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Balances Across Chains</h2>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Current Chain Balance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {chain?.name}
                      {chain?.id === chain?.id && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {ethBalance ? `${Number(ethBalance.formatted).toFixed(4)} ${ethBalance.symbol}` : "0.0000"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Native Token</p>
                  </CardContent>
                </Card>

                {/* USDT on Base */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">USDT (Base)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {usdtBase ? `${Number(usdtBase.formatted).toFixed(2)}` : "0.00"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Stablecoin</p>
                    {chain?.id !== base.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => switchChain?.({ chainId: base.id })}
                      >
                        Switch to Base
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* USDC on Base */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">USDC (Base)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {usdcBase ? `${Number(usdcBase.formatted).toFixed(2)}` : "0.00"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Stablecoin</p>
                    {chain?.id !== base.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => switchChain?.({ chainId: base.id })}
                      >
                        Switch to Base
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* cUSD on Celo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">cUSD (Celo)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {cUSD ? `${Number(cUSD.formatted).toFixed(2)}` : "0.00"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Stablecoin</p>
                    {chain?.id !== celo.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => switchChain?.({ chainId: celo.id })}
                      >
                        Switch to Celo
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* PC on Push Chain */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Push Chain Donut</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {pcBalance ? `${Number(pcBalance.formatted).toFixed(4)} PC` : "0.0000 PC"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Native Token</p>
                    {chain?.id !== pushChain.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => switchChain?.({ chainId: pushChain.id })}
                      >
                        Switch to Push Chain
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* ETH on Sepolia */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sepolia Testnet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {sepoliaBalance ? `${Number(sepoliaBalance.formatted).toFixed(4)} ETH` : "0.0000 ETH"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Native Token</p>
                    {chain?.id !== sepolia.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => switchChain?.({ chainId: sepolia.id })}
                      >
                        Switch to Sepolia
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* STT on Somnia */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Somnia Testnet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {somniaBalance ? `${Number(somniaBalance.formatted).toFixed(4)} STT` : "0.0000 STT"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Native Token</p>
                    {chain?.id !== somniaTestnet.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => switchChain?.({ chainId: somniaTestnet.id })}
                      >
                        Switch to Somnia
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* cUSD on Celo Alfajores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">cUSD (Celo Alfajores)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {celoAlfajoresBalance ? `${Number(celoAlfajoresBalance.formatted).toFixed(2)}` : "0.00"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Stablecoin</p>
                    {chain?.id !== celoAlfajores.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => switchChain?.({ chainId: celoAlfajores.id })}
                      >
                        Switch to Celo Alfajores
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* CELO on Celo Sepolia */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Celo Sepolia Testnet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {celoSepoliaBalance ? `${Number(celoSepoliaBalance.formatted).toFixed(4)} CELO` : "0.0000 CELO"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Native Token</p>
                    {chain?.id !== celoSepoliaTestnet.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => switchChain?.({ chainId: celoSepoliaTestnet.id })}
                      >
                        Switch to Celo Sepolia
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="gradient" className="flex-1" onClick={() => window.location.href = '/transfer'}>
                  Send Tokens
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/history'}>
                  View History
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`${chain?.blockExplorers?.default.url}/address/${address}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Wallets;
