import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Trash2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useRecipients } from "@/hooks/useRecipients";
import { useNavigate } from "react-router-dom";



const Recipients = () => {
  const { isConnected } = useAccount();
  const { recipients, loading, addRecipient, removeRecipient } = useRecipients();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");

  const handleAddRecipient = async () => {
    if (!nickname || !address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await addRecipient(address, nickname);
      setNickname("");
      setAddress("");
      setOpen(false);
      toast({
        title: "Success",
        description: "Recipient added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add recipient",
        variant: "destructive",
      });
    }
  };

  const handleRemoveRecipient = async (id: string) => {
    try {
      await removeRecipient(id);
      toast({
        title: "Success",
        description: "Recipient removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove recipient",
        variant: "destructive",
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
              Connect your wallet to manage recipients
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
            <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Saved Recipients
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your frequently used wallet addresses
                </p>
              </div>
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Recipient
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Recipient</DialogTitle>
                    <DialogDescription>
                      Save a wallet address for quick transfers
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., John Doe"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Wallet Address</Label>
                      <Input
                        id="address"
                        placeholder="0x..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <Button onClick={handleAddRecipient} className="w-full">
                      Add Recipient
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading recipients...</p>
            </div>
          ) : recipients.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-4">
                    No saved recipients yet
                  </p>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Add frequently used wallet addresses to make sending tokens faster and easier
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {recipients.map((recipient) => (
                  <Card key={recipient.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-lg">{recipient.nickname || 'Unnamed'}</p>
                          <p className="text-sm text-muted-foreground font-mono mt-1">
                            {recipient.recipient_address}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = '/transfer'}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveRecipient(recipient.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Recipients;
