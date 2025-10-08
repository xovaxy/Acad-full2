import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      detail: "contact@xovaxy.in",
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: "📱",
      title: "Instagram",
      detail: "@xovaxy.ai",
      description: "Follow us for updates and educational content"
    },
    {
      icon: "📞",
      title: "Demo Call",
      detail: "Book a Demo",
      description: "Schedule a personalized demo of Acadira platform"
    },
    {
      icon: "💬",
      title: "Sales Inquiry",
      detail: "Enterprise Sales",
      description: "Contact our sales team for institutional pricing"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for your message! We'll get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2">Contact Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Get in Touch with Acadira
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to bring AI-powered tutoring to your institution? 
              Contact us for demos, pricing, or any questions about Acadira.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="gradient-card border-0 shadow-soft hover:shadow-card transition-smooth text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="text-3xl">{method.icon}</div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{method.title}</h3>
                    <p className="text-primary font-medium">{method.detail}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">
                    Book a Demo with Acadira
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Fill out the form and our team will reach out to schedule a 
                    personalized demo of the Acadira platform for your institution.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground">See how curriculum upload works</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Experience the AI tutor interface</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Explore admin dashboard features</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Discuss institutional pricing</span>
                  </div>
                </div>

                <Card className="gradient-card border-0 shadow-soft">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Demo Duration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our demos typically last 30-45 minutes and can be customized 
                      to focus on your institution's specific needs.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Available Monday-Friday, 9 AM - 6 PM</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="gradient-card border-0 shadow-feature">
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
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
                        <Label htmlFor="institution">Institution *</Label>
                        <Input 
                          id="institution" 
                          placeholder="School/College name"
                          required
                        />
                      </div>
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
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message"
                        placeholder="Tell us about your institution and how Acadira can help..."
                        rows={4}
                      />
                    </div>
                    
                    <Button type="submit" variant="hero" className="w-full">
                      Send Message & Book Demo
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our privacy policy. 
                      We'll only use your information to schedule demos and provide relevant updates.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Prefer Direct Contact?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Reach out to us directly through email or social media for immediate assistance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@xovaxy.in">
                <Button variant="outline" size="lg">
                  📧 Email Us
                </Button>
              </a>
              <a href="https://instagram.com/xovaxy.ai" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  📱 Follow on Instagram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;