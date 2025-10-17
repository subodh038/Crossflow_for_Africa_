import { LayoutGrid, ArrowLeftRight, Wallet, BarChart3, Clock, Settings, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutGrid },
  { name: "Transfer", href: "/transfer", icon: ArrowLeftRight },
  { name: "Wallets", href: "/wallets", icon: Wallet },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "History", href: "/history", icon: Clock },
  { name: "Recipients", href: "/recipients", icon: Users },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-20 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col items-center gap-8 py-8">
        {/* Logo */}
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
          <span className="text-2xl font-bold text-white">A</span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                title={item.name}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
