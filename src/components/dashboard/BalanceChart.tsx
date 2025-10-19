import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAccount } from "wagmi";
import { useBalanceHistory } from "@/hooks/useBalanceHistory";

export function BalanceChart() {
  const { address } = useAccount();
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "yearly">("weekly");

  // You can make useBalanceHistory accept timeframe (e.g., useBalanceHistory(address, timeframe))
  const { balanceData, currentBalance, balanceChange, changeAmount } =
    useBalanceHistory(address);

  // Temporary mock/fallback data until hook supports timeframes
  const chartData = useMemo(() => {
    switch (timeframe) {
      case "monthly":
        return [
          { day: "Week 1", value: 5.2 },
          { day: "Week 2", value: 5.8 },
          { day: "Week 3", value: 6.3 },
          { day: "Week 4", value: 6.5 },
        ];
      case "yearly":
        return [
          { day: "Jan", value: 4.8 },
          { day: "Apr", value: 5.6 },
          { day: "Jul", value: 6.2 },
          { day: "Oct", value: 6.7 },
        ];
      default:
        return [
          { day: "Mon", value: 5.1 },
          { day: "Tue", value: 5.5 },
          { day: "Wed", value: 5.3 },
          { day: "Thu", value: 6.0 },
          { day: "Fri", value: 5.9 },
          { day: "Sat", value: 6.2 },
          { day: "Sun", value: 6.1 },
        ];
    }
  }, [timeframe]);

  return (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Balance Overview</h3>
        <Tabs value={timeframe} onValueChange={(val: any) => setTimeframe(val)}>
          <TabsList className="bg-muted">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-6">
        <p className="text-4xl font-bold">{currentBalance.toFixed(4)} Celo</p>
        <p
          className={`text-sm mt-1 ${
            parseFloat(balanceChange) >= 0
              ? "text-success"
              : "text-destructive"
          }`}
        >
          {parseFloat(balanceChange) >= 0 ? "+" : ""}
          {changeAmount} ETH (
          {parseFloat(balanceChange) >= 0 ? "+" : ""}
          {balanceChange}%)
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(2)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(330, 80%, 55%)"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
