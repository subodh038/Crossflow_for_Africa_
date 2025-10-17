import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { useRecipients } from "@/hooks/useRecipients";
import { useRealtimeTransactions } from '@/hooks/useRealtimeTransactions'

export default function Dashboard() {
  const { transactions, loading } = useRealtimeTransactions()

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h2>Your Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transaction data available yet</p>
      ) : (
        transactions.map((tx) => (
          <div key={tx.id}>
            <p>
              <b>{tx.token}</b> — {tx.amount} sent to {tx.to_address}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export function QuickTransfer() {
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [amount, setAmount] = useState("");
  const { recipients, loading } = useRecipients();
  
  const recentRecipients = recipients.slice(0, 4);

  return (
    <Card className="p-6 border-border bg-card">
      <h3 className="text-xl font-semibold mb-6">Quick Transfer</h3>

      {/* Recent Recipients */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Recent Recipients</p>
        <div className="flex gap-3">
          {loading ? (
            <p className="text-xs text-muted-foreground">Loading...</p>
          ) : recentRecipients.length === 0 ? (
            <p className="text-xs text-muted-foreground">No recent recipients</p>
          ) : (
            recentRecipients.map((recipient) => {
              const initials = recipient.nickname 
                ? recipient.nickname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                : recipient.recipient_address.slice(2, 4).toUpperCase();
              
              return (
                <button
                  key={recipient.id}
                  onClick={() => setSelectedRecipient(recipient.recipient_address)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary transition-colors">
                    <AvatarFallback className="bg-primary/20 text-primary font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate w-14">
                    {recipient.nickname || `${recipient.recipient_address.slice(0, 6)}...`}
                  </span>
                </button>
              );
            })
          )}
          <button className="flex flex-col items-center gap-2 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 group-hover:border-primary transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs text-muted-foreground">New</span>
          </button>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1.5 bg-input border-border"
          />
        </div>

        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select defaultValue="usdt">
            <SelectTrigger id="currency" className="mt-1.5 bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usdt">USDT - Tether</SelectItem>
              <SelectItem value="usdc">USDC - USD Coin</SelectItem>
              <SelectItem value="cusd">cUSD - Celo Dollar</SelectItem>
               <SelectItem value="CELO">CELO (Native - Celo)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="recipient">Recipient</Label>
          <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
            <SelectTrigger id="recipient" className="mt-1.5 bg-input border-border">
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              {recipients.map((recipient) => (
                <SelectItem key={recipient.id} value={recipient.recipient_address}>
                  {recipient.nickname || 'Unnamed'} ({recipient.recipient_address.slice(0, 10)}...)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" variant="gradient" size="lg">
          Send Transfer
        </Button>
      </div>
    </Card>
  );
}
