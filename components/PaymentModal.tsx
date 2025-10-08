import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const [institutionDetails, setInstitutionDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [cashfreeApiKey, setCashfreeApiKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!cashfreeApiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Cashfree API key to process payments.",
        variant: "destructive",
      });
      return;
    }

    if (!institutionDetails.name || !institutionDetails.email || !institutionDetails.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required institution details.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create Cashfree payment session
      const paymentData = {
        order_amount: 80000,
        order_currency: "INR",
        order_id: `ACADIRA_${Date.now()}`,
        customer_details: {
          customer_id: `INST_${Date.now()}`,
          customer_name: institutionDetails.name,
          customer_email: institutionDetails.email,
          customer_phone: institutionDetails.phone,
        },
        order_meta: {
          return_url: `${window.location.origin}/pricing?payment=success`,
          notify_url: `${window.location.origin}/api/payment/webhook`,
        },
        order_note: "Acadira Institution License - Annual Subscription"
      };

      // Generate Cashfree payment URL (using sandbox for demo)
      const cashfreePaymentUrl = `https://sandbox.cashfree.com/billpay/checkout/post/submit?` +
        `orderId=${paymentData.order_id}&` +
        `orderAmount=${paymentData.order_amount}&` +
        `orderCurrency=${paymentData.order_currency}&` +
        `customerName=${encodeURIComponent(paymentData.customer_details.customer_name)}&` +
        `customerEmail=${encodeURIComponent(paymentData.customer_details.customer_email)}&` +
        `customerPhone=${paymentData.customer_details.customer_phone}&` +
        `returnUrl=${encodeURIComponent(paymentData.order_meta.return_url)}&` +
        `notifyUrl=${encodeURIComponent(paymentData.order_meta.notify_url)}&` +
        `orderNote=${encodeURIComponent(paymentData.order_note)}`;

      toast({
        title: "Redirecting to Payment Gateway",
        description: "You will be redirected to Cashfree in a moment...",
      });

      // Redirect to Cashfree payment gateway
      setTimeout(() => {
        window.location.href = cashfreePaymentUrl;
      }, 1500);

    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Subscribe to Acadira
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subscription Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span>Acadira Institution License (Annual)</span>
                <span className="text-2xl font-bold text-primary">₹80,000</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Institution Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  value={institutionDetails.name}
                  onChange={(e) => setInstitutionDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter institution name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={institutionDetails.email}
                  onChange={(e) => setInstitutionDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@institution.edu"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={institutionDetails.phone}
                  onChange={(e) => setInstitutionDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={institutionDetails.address}
                  onChange={(e) => setInstitutionDetails(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Institution address"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="cashfreeKey">Cashfree API Key</Label>
                <Input
                  id="cashfreeKey"
                  type="password"
                  value={cashfreeApiKey}
                  onChange={(e) => setCashfreeApiKey(e.target.value)}
                  placeholder="Enter your Cashfree API key (will be used for secure payment processing)"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your Cashfree API key is required to process payments securely. You'll be redirected to Cashfree payment gateway.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing || !institutionDetails.name || !institutionDetails.email || !cashfreeApiKey}
              className="flex-1"
            >
              {isProcessing ? "Redirecting to Cashfree..." : "Subscribe Now - ₹80,000"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;