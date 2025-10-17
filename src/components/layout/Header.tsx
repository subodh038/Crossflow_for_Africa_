import { Search, Bell } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed left-20 right-0 top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-input border-border"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary"></span>
          </Button>

          {/* Wallet Connect */}
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </div>
    </header>
  );
}
