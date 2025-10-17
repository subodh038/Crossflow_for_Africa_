import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconClassName?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", iconClassName)}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{title}</p>
          </div>
        </div>
        {change && (
          <span
            className={cn(
              "text-sm font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </Card>
  );
}