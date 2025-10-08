import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const features = [
    "Complete Admin Dashboard Access",
    "Unlimited Student Logins", 
    "Private AI Tutor for Your Institution",
    "Curriculum-Specific Knowledge Base",
    "No External Data or Distractions",
    "Detailed Usage Analytics",
    "Secure Multi-Tenant Architecture",
    "24/7 Student Access",
    "Role-Based Access Control",
    "Enterprise-Grade Security",
    "Dedicated Customer Support",
    "Regular Platform Updates"
  ];

  const faqs = [
    {
      question: "What's included in the annual subscription?",
      answer: "Complete access to admin dashboard, unlimited student accounts, private AI tutor, analytics, and full customer support."
    },
    {
      question: "Can students access without subscription?",
      answer: "No, students can only access the AI tutor after their institution has an active subscription. Unsubscribed access shows a subscription required screen."
    },
    {
      question: "Is our curriculum data secure?",
      answer: "Yes, each institution has a completely private data silo. Your curriculum data never mixes with other institutions and is encrypted at rest."
    },
    {
      question: "How many students can use the platform?",
      answer: "Unlimited students per institution. The ₹80,000 annual fee covers your entire institution regardless of student count."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2">Institutional Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              One annual subscription covers your entire institution with unlimited student access 
              and a private AI tutor built from your curriculum.
            </p>
          </div>
        </div>
      </section>

      {/* Main Pricing Card */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="gradient-card border-0 shadow-feature relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-6 py-2 rounded-bl-lg">
                <span className="text-sm font-semibold">Most Popular</span>
              </div>
              
              <CardHeader className="text-center space-y-6 pb-8">
                <div>
                  <CardTitle className="text-3xl font-bold text-foreground mb-2">
                    Acadira Institution License
                  </CardTitle>
                  <p className="text-muted-foreground">Complete AI tutoring platform for your institution</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-5xl font-bold text-primary">₹80,000</span>
                    <div className="text-left">
                      <div className="text-sm text-muted-foreground">per year</div>
                      <div className="text-xs text-muted-foreground">~₹6,667/month</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">One-time annual payment • No hidden fees</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center space-y-4 pt-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full sm:w-auto"
                      onClick={() => setIsPaymentModalOpen(true)}
                    >
                      Subscribe Now
                    </Button>
                    <Link to="/demo">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Request a Demo
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Contact Sales
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Free demo available • No credit card required
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Need an Enterprise Plan?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                For large universities, state education boards, or institutions requiring 
                custom integrations and dedicated support.
              </p>
            </div>
            
            <Card className="gradient-card border-0 shadow-card">
              <CardContent className="p-8 text-center space-y-6">
                <div className="text-4xl">🏛️</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Enterprise Solutions</h3>
                  <p className="text-muted-foreground">
                    Custom pricing for large-scale deployments with advanced features, 
                    dedicated support, and white-label options.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>✓ Multiple institution management</div>
                    <div>✓ Advanced analytics and reporting</div>
                    <div>✓ Custom integrations (LMS, ERP)</div>
                    <div>✓ Dedicated account manager</div>
                    <div>✓ White-label branding options</div>
                  </div>
                </div>
                <Link to="/contact">
                  <Button variant="outline">
                    Contact Sales for Enterprise
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Common questions about Acadira pricing and features.
              </p>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="gradient-card border-0 shadow-soft">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Link to="/contact">
                <Button variant="outline">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </div>
  );
};

export default Pricing;