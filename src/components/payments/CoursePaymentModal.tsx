import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Copy, Smartphone, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoursePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  ticketPrice: number;
  eventId: string | null;
  onSuccess: () => void;
}

export function CoursePaymentModal({ open, onOpenChange, eventTitle, ticketPrice, eventId, onSuccess }: CoursePaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [manualMethods, setManualMethods] = useState<any[]>([]);
  const [listingFee, setListingFee] = useState(0);
  
  // Manual Payment State
  const [mpesaCode, setMpesaCode] = useState("");
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    if (open && ticketPrice) {
       // 10% Fee Logic (must match server)
       const calculatedFee = Math.max(ticketPrice * 0.10, 100);
       setListingFee(calculatedFee);
       fetchManualMethods();
    }
  }, [open, ticketPrice]);

  const fetchManualMethods = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('paystack-integration', {
        body: { action: 'get_manual_details' }
      });
      if (error) throw error;
      setManualMethods(data.methods || []);
    } catch (err) {
      console.error("Failed to fetch manual methods", err);
    }
  };

  const handlePaystackInit = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase.functions.invoke('paystack-integration', {
        body: {
          action: 'initialize_transaction',
          userId: user.id,
          email: user.email,
          amount: ticketPrice, 
          metadata: {
            event_id: eventId,
            event_title: eventTitle
          }
        }
      });

      if (error) throw error;
      
      if (data.authorization_url) {
        window.open(data.authorization_url, '_blank');
        toast.info("Payment page opened. Please authorize payment.");
      }

    } catch (err: any) {
      toast.error(err.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerify = async () => {
      // Validation
      if (!mpesaCode || mpesaCode.length < 10) {
          toast.error("Please enter a valid M-Pesa Code (e.g. QXH...)");
          return;
      }
      if (!senderName || senderName.length < 3) {
          toast.error("Please enter the Sender Name (who sent the money?)");
          return;
      }

      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Please login first");

        // Use the new secure endpoint
        const { error } = await supabase.functions.invoke('paystack-integration', {
            body: {
                action: 'submit_manual_claim',
                userId: user.id,
                mpesa_code: mpesaCode,
                sender_name: senderName,
                amount: listingFee,
                payment_purpose: 'COURSE_LISTING',
                metadata: {
                    event_id: eventId,
                    event_title: eventTitle
                }
            }
        });

        if (error) throw error;

        toast.success("Payment submitted! Admin will verify shortly.");
        onSuccess(); // Close and refresh
        onOpenChange(false);

      } catch (err: any) {
          console.error("Manual Claim Error:", err);
          toast.error(err.message || "Failed to submit claim. Code might be used.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Complete Your Course Listing</DialogTitle>
          <DialogDescription>
            To maintain quality, we charge a 10% listing fee (verified upfront).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
             <div>
                <p className="font-medium">{eventTitle}</p>
                <p className="text-sm text-muted-foreground">Ticket Price: KES {ticketPrice.toLocaleString()}</p>
             </div>
             <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold">Listing Fee (10%)</p>
                <p className="text-xl font-bold text-primary">KES {listingFee.toLocaleString()}</p>
             </div>
          </div>

          <Tabs defaultValue="paystack" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paystack">Pay with Paystack</TabsTrigger>
              <TabsTrigger value="manual">Manual Transfer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paystack" className="space-y-4">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                       <CreditCard className="h-5 w-5"/> 
                       M-Pesa / Card 
                   </CardTitle>
                   <CardDescription>Secure automated payment via Paystack.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <Button onClick={handlePaystackInit} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Pay KES {listingFee.toLocaleString()}
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3 w-3 text-green-600"/>
                        Secured by Paystack
                    </div>
                 </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
               <ScrollArea className="h-[200px] pr-4 border rounded-md p-2 mb-4 bg-stone-50">
                 {manualMethods.length === 0 && <p className="text-sm text-muted-foreground p-4">Loading payment details...</p>}
                 {manualMethods.map((method) => (
                    <div key={method.id} className="mb-3 p-3 bg-white border rounded shadow-sm text-sm">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold flex items-center gap-1">
                                <Smartphone className="h-4 w-4 text-green-600"/>
                                {method.name}
                            </span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <code className="text-base font-bold text-slate-800">{method.account_number}</code>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                                navigator.clipboard.writeText(method.account_number);
                                toast.success("Copied!");
                            }}>
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{method.instructions}</p>
                        {method.account_name && <p className="text-xs font-semibold mt-1">Account Name: {method.account_name}</p>}
                    </div>
                 ))}
               </ScrollArea>
                
                <div className="space-y-3">
                   <div className="space-y-1">
                       <Label>Sender Name</Label>
                       <Input 
                           placeholder="e.g. John Doe (Name on M-Pesa SMS)" 
                           value={senderName}
                           onChange={(e) => setSenderName(e.target.value)}
                       />
                   </div>
                   <div className="space-y-1">
                       <Label>Transaction Code</Label>
                       <Input 
                           placeholder="e.g. QXH12..." 
                           className="uppercase font-mono"
                           value={mpesaCode}
                           maxLength={10}
                           onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                       />
                   </div>
                </div>

                <Button onClick={handleManualVerify} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Verify Payment"}
                </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
