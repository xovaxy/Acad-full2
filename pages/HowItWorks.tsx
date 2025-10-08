import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Institution Subscribes",
      description: "Your educational institution subscribes to Acadira for ₹80,000/year, getting complete access to the platform.",
      icon: "💳",
      details: ["Annual subscription model", "Complete platform access", "Admin dashboard included", "Unlimited student accounts"]
    },
    {
      step: "02", 
      title: "Admin Uploads Curriculum",
      description: "Institution administrators upload curriculum PDFs, notes, question banks, and syllabus materials through the secure dashboard.",
      icon: "📚",
      details: ["PDF curriculum upload", "Notes and materials", "Question bank integration", "Secure file processing"]
    },
    {
      step: "03",
      title: "AI Ingests & Builds Tutor", 
      description: "Acadira's AI processes your curriculum and creates a private, syllabus-specific AI tutor for your students.",
      icon: "🤖",
      details: ["AI curriculum analysis", "Knowledge base creation", "Private tutor instance", "Syllabus alignment"]
    },
    {
      step: "04",
      title: "Students Access AI Tutor",
      description: "Students log in with institution-provided credentials and access their personalized, curriculum-aligned AI tutor.",
      icon: "🎓",
      details: ["Secure student login", "Curriculum-specific answers", "24/7 availability", "Progress tracking"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2">How It Works</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Simple Steps to Transform Your Curriculum
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From subscription to AI tutoring in 4 easy steps. See how Acadira transforms 
              your institution's curriculum into an intelligent tutoring system.
            </p>
          </div>

          <div className="space-y-12 mb-16">
            {steps.map((step, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{step.icon}</div>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-primary">{step.step}</span>
                      <div className="w-12 h-0.5 bg-primary"></div>
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{step.title}</h2>
                  <p className="text-lg text-muted-foreground">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Card className={`gradient-card border-0 shadow-feature ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <CardContent className="p-8">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                      <span className="text-6xl opacity-50">{step.icon}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-6 mb-12">
            <div className="flex items-start space-x-3">
              <div className="text-red-500 text-xl">🛑</div>
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Important: Subscription Required</h3>
                <p className="text-red-700 text-sm">
                  Students can only access the AI Tutor after their institution has an active subscription. 
                  Unsubscribed visitors will see a "Subscription Required" screen when attempting to access the tutor.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ready to Get Started?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button variant="hero" size="lg">
                  Book a Demo
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;