import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const Demo = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for booking a demo! Our team will contact you within 24 hours to schedule your personalized demonstration.");
  };

  const demoFeatures = [
    "Live curriculum upload demonstration",
    "AI tutor interaction showcase",
    "Admin dashboard walkthrough", 
    "Student interface preview",
    "Analytics and reporting overview",
    "Security and compliance discussion",
    "Pricing and implementation planning",
    "Q&A session with our experts"
  ];

  const benefits = [
    {
      title: "See Real Results",
      description: "Watch how your actual curriculum gets transformed into an intelligent AI tutor",
      icon: "🎯"
    },
    {
      title: "Hands-On Experience", 
      description: "Try the platform yourself with guided support from our team",
      icon: "👥"
    },
    {
      title: "Custom Consultation",
      description: "Get personalized advice for your institution's specific needs",
      icon: "💡"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2">Book Your Demo</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              See Acadira in Action
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Schedule a personalized demo to see how Acadira can transform your institution's 
              curriculum into an intelligent AI tutoring platform.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="gradient-card border-0 shadow-soft text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="text-4xl">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">
                    What to Expect in Your Demo
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Our 45-minute personalized demo will show you exactly how Acadira 
                    works for your institution.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {demoFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Card className="gradient-card border-0 shadow-soft">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-3">Demo Agenda</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Platform overview</span>
                        <span>10 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Live demonstration</span>
                        <span>25 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Q&A and planning</span>
                        <span>10 minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-green-500 text-xl">✅</div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">Free Consultation</h4>
                      <p className="text-green-700 text-sm">
                        No obligation demo with personalized implementation planning 
                        for your institution's specific requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="gradient-card border-0 shadow-feature">
                <CardHeader>
                  <CardTitle>Schedule Your Demo</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill out this form and we'll contact you to schedule your personalized demonstration.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input 
                          id="name" 
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input 
                          id="title" 
                          placeholder="Principal, Dean, etc."
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution Name *</Label>
                      <Input 
                        id="institution" 
                        placeholder="School/College/University name"
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="students">Number of Students</Label>
                      <Input 
                        id="students" 
                        placeholder="e.g., 500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Specific Requirements</Label>
                      <Textarea 
                        id="message"
                        placeholder="Tell us about your current challenges and what you'd like to see in the demo..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Implementation Timeline</Label>
                      <select className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md">
                        <option value="">Select timeline</option>
                        <option value="immediate">Immediate (within 1 month)</option>
                        <option value="quarter">This quarter (1-3 months)</option>
                        <option value="semester">Next semester (3-6 months)</option>
                        <option value="planning">Just exploring options</option>
                      </select>
                    </div>
                    
                    <Button type="submit" variant="hero" className="w-full">
                      Schedule My Demo
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to be contacted by our team. 
                      We respect your privacy and will never share your information.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                What Happens After You Book?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Here's what you can expect once you schedule your demo with Acadira.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold">Confirmation Call</h3>
                <p className="text-sm text-muted-foreground">
                  We'll call within 24 hours to schedule your demo at a convenient time.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold">Personalized Demo</h3>
                <p className="text-sm text-muted-foreground">
                  45-minute live demonstration tailored to your institution's needs.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold">Implementation Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Receive a custom proposal and implementation timeline for your institution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Demo;