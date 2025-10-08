import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Features = () => {
  const adminFeatures = [
    {
      icon: "📤",
      title: "Curriculum Upload",
      description: "Easy drag-and-drop interface to upload PDFs, notes, and question banks."
    },
    {
      icon: "📊",
      title: "Student Analytics",
      description: "Monitor student queries, identify weak topics, and track learning progress."
    },
    {
      icon: "📈",
      title: "Usage Insights",
      description: "Detailed analytics on AI tutor usage patterns and student engagement."
    },
    {
      icon: "👥",
      title: "User Management",
      description: "Create and manage student accounts with role-based access control."
    },
    {
      icon: "🔒",
      title: "Secure Access",
      description: "Institution-level security with encrypted data and private knowledge base."
    },
    {
      icon: "⚙️",
      title: "System Configuration",
      description: "Customize AI tutor behavior and manage institutional settings."
    }
  ];

  const studentFeatures = [
    {
      icon: "💬",
      title: "ChatGPT-like Interface",
      description: "Familiar chat interface for natural conversation with the AI tutor."
    },
    {
      icon: "🎯",
      title: "Curriculum-Specific Answers",
      description: "AI responses strictly limited to your institution's uploaded syllabus."
    },
    {
      icon: "🕐",
      title: "24/7 Availability",
      description: "Round-the-clock access to personalized tutoring support."
    },
    {
      icon: "📝",
      title: "Personalized Quizzes",
      description: "AI-generated quizzes based on your curriculum and learning progress."
    },
    {
      icon: "🃏",
      title: "Smart Flashcards",
      description: "Dynamic flashcards created from your syllabus for effective revision."
    },
    {
      icon: "📚",
      title: "Study Assistant",
      description: "Intelligent study recommendations and learning path optimization."
    }
  ];

  const securityFeatures = [
    {
      icon: "🔐",
      title: "Role-Based Login",
      description: "Separate access levels for Admins, Teachers, and Students with appropriate permissions."
    },
    {
      icon: "🚫",
      title: "Subscription Wall",
      description: "Students cannot access the platform unless their institution has an active subscription."
    },
    {
      icon: "🏢",
      title: "Private Data Silos",
      description: "Each institution has its own isolated AI tutor instance and knowledge base."
    },
    {
      icon: "🔒",
      title: "Data Encryption",
      description: "Enterprise-grade encryption for all uploaded curriculum and student interactions."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2">Platform Features</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Comprehensive AI Tutoring Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover all the powerful features that make Acadira the perfect AI tutoring 
              solution for educational institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Dashboard Features */}
      <section className="py-16 bg-gradient-feature">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Admin Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete administrative control over your institution's AI tutoring platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {adminFeatures.map((feature, index) => (
              <Card key={index} className="gradient-card border-0 shadow-soft hover:shadow-card transition-smooth">
                <CardHeader>
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Admin Dashboard Preview</h3>
            <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/20">
              <div className="text-center space-y-2">
                <div className="text-4xl">📊</div>
                <p className="text-muted-foreground">Interactive Admin Dashboard Demo</p>
                <Link to="/admin-dashboard">
                  <Button variant="cta" size="sm">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Interface Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Student Interface</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Intuitive and engaging AI tutoring experience designed for students.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {studentFeatures.map((feature, index) => (
              <Card key={index} className="gradient-card border-0 shadow-soft hover:shadow-card transition-smooth">
                <CardHeader>
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Student AI Tutor Preview</h3>
            <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/20">
              <div className="text-center space-y-2">
                <div className="text-4xl">🤖</div>
                <p className="text-muted-foreground">AI Tutor Interface Demo</p>
                <Link to="/student-tutor">
                  <Button variant="cta" size="sm">
                    Try AI Tutor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Security & Scalability</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade security with multi-tenant architecture for educational institutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="gradient-card border-0 shadow-soft hover:shadow-card transition-smooth text-center">
                <CardHeader>
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-card p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Multi-Tenant SaaS Architecture</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every institution gets its own private AI tutor instance with isolated data and 
              curriculum-specific knowledge base. Scale from small coaching centers to large universities.
            </p>
            <div className="flex justify-center">
              <Link to="/demo">
                <Button variant="hero">
                  Request Enterprise Demo
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

export default Features;