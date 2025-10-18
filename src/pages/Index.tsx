import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { QuickTransfer } from "@/components/dashboard/QuickTransfer";
import { Wallet, ArrowLeftRight, Activity, Users } from "lucide-react";
import { useAccount } from "wagmi";
import { useUserStats } from "@/hooks/useUserStats";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Index = () => {
  const { isConnected, address } = useAccount();
  const stats = useUserStats(address);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-20">
        <Header />
        <main className="px-8 pt-24 pb-12">
          {!isConnected ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary">
                    <Wallet className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-3">Welcome to AFri-Cash</h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                 Seamless on-chain payments across Africa — from cross-border remittances to merchant transactions and DeFi innovation on Celo.
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center px-4">
                    <p className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">Base</p>
                    <p className="text-xs text-muted-foreground mt-1">Ethereum L2</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-2xl font-bold gradient-secondary bg-clip-text text-transparent">Celo</p>
                    <p className="text-xs text-muted-foreground mt-1">Mobile-first</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-2xl font-bold text-primary">Ethereum</p>
                    <p className="text-xs text-muted-foreground mt-1">Mainnet</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Section */}
              <div className="mb-8">
                <p className="text-muted-foreground">Here's what's happening with your account today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                  title="Total Balance"
                  value={`$${stats.balance}`}
                  change={stats.balanceChange}
                  changeType="positive"
                  icon={Wallet}
                  iconClassName="bg-primary/10 text-primary"
                />
                <StatCard
                  title="Total Transfers"
                  value={stats.transferCount.toString()}
                  change={stats.transferChange}
                  changeType="positive"
                  icon={ArrowLeftRight}
                  iconClassName="bg-secondary/10 text-secondary"
                />
                <StatCard
                  title="Active Wallets"
                  value="1"
                  change="— 0%"
                  changeType="neutral"
                  icon={Activity}
                  iconClassName="bg-accent/10 text-accent"
                />
                <StatCard
                  title="Saved Recipients"
                  value={stats.recipientCount.toString()}
                  change={stats.recipientChange}
                  changeType="positive"
                  icon={Users}
                  iconClassName="bg-success/10 text-success"
                />
              </div>

              {/* Charts and Transfer */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <BalanceChart />
                </div>
                <div>
                  <QuickTransfer />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
