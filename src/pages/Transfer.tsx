import { useState } from "react";
import { useAccount, useSendTransaction, useWriteContract, useBalance } from "wagmi";
import { parseEther, parseUnits, formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useTransactionTracker } from "@/hooks/useTransactionTracker";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS } from "@/lib/tokenAddresses";
import { erc20Abi } from "@/lib/erc20Abi";

const Transfer = () => {
  const { address, isConnected, chain } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("ETH");

  const { data: hash, sendTransaction, isPending: isSendingNative } = useSendTransaction();
  const { data: contractHash, writeContract, isPending: isSendingToken } = useWriteContract();
  
  // Get balance for validation
  const { data: balance } = useBalance({
    address: address,
    chainId: chain?.id,
  });
  
  const txHash = hash || contractHash;
  const isPending = isSendingNative || isSendingToken;
  
  useTransactionTracker(txHash, recipient, amount, token);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation 1: Check all fields are filled
    if (!recipient || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Validation 2: Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    // Validation 3: Validate amount is positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    // Validation 4: Check amount isn't too small (dust)
    if (amountNum < 0.000001) {
      toast({
        title: "Amount Too Small",
        description: "Minimum amount: 0.000001",
        variant: "destructive",
      });
      return;
    }

    // Validation 5: Check sufficient balance for native tokens
    const isNativeToken = token === "ETH" || token === "PC" || token === "CELO" || token === "STT";
    if (isNativeToken && balance) {
      const currentBalance = parseFloat(formatEther(balance.value));
      if (currentBalance < amountNum) {
        toast({
          title: "Insufficient Balance",
          description: `You have ${currentBalance.toFixed(6)} ${token}`,
          variant: "destructive",
        });
        return;
      }
    }

    // Validation 6: Check network compatibility
    if (!chain) {
      toast({
        title: "Network Error",
        description: "Please connect to a network",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isNativeToken) {
        // Send native token (ETH or PC)
        sendTransaction({
          to: recipient as `0x${string}`,
          value: parseEther(amount),
        });
      } else {
        // Send ERC-20 token
        const tokenAddress = TOKEN_ADDRESSES[token as keyof typeof TOKEN_ADDRESSES]?.[chain.id];
        
        if (!tokenAddress) {
          toast({
            title: "Token Not Available",
            description: `${token} is not available on ${chain.name}`,
            variant: "destructive",
          });
          return;
        }
        
        if (!address) {
          toast({
            title: "Wallet Not Connected",
            description: "Please connect your wallet",
            variant: "destructive",
          });
          return;
        }
        
        const decimals = TOKEN_DECIMALS[token as keyof typeof TOKEN_DECIMALS];
        
        writeContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [recipient as `0x${string}`, parseUnits(amount, decimals)],
          account: address,
          chain: chain,
        });
      }
      
      toast({
        title: "Transaction Submitted",
        description: "Your transaction has been submitted to the network",
      });
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to send tokens
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
            <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Send Tokens
              </h1>
              <p className="text-muted-foreground mt-2">
                Transfer tokens to any wallet address on {chain?.name}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transfer Details</CardTitle>
                <CardDescription>
                  Enter recipient address and amount to send
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSend} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="token">Token</Label>
                    <Select value={token} onValueChange={setToken}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETH">ETH (Native)</SelectItem>
                        <SelectItem value="PC">PC (Push Chain)</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="cUSD">cUSD (Celo)</SelectItem>
                         <SelectItem value="CELO">CELO (Native - Celo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.000001"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-medium">{chain?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Gas Fee</span>
                      <span className="font-medium">~0.0001 {chain?.nativeCurrency.symbol}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="gradient"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isPending ? "Confirming..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        Send {token}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                  {txHash && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm font-medium">Transaction successful!</p>
                      <a 
                        href={`${chain?.blockExplorers?.default.url}/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View on Explorer →
                      </a>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Transfer;
