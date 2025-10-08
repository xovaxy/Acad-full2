import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: "🎯",
      title: "Educational Focus",
      description: "We believe AI tutoring should be curriculum-specific, not generic. Every answer should align with what students actually need to learn."
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description: "Educational data is sacred. We ensure complete data privacy with institution-specific silos and enterprise-grade security."
    },
    {
      icon: "⚡",
      title: "Accessible Innovation",
      description: "Making advanced AI tutoring accessible to all educational institutions, from small coaching centers to large universities."
    },
    {
      icon: "🤝",
      title: "Partnership Approach",
      description: "We work closely with educators to understand their needs and continuously improve our platform based on real feedback."
    }
  ];

  const team = [
    {
      role: "Product Development",
      description: "Building the future of AI-powered education with focus on curriculum alignment and student outcomes."
    },
    {
      role: "AI Research",
      description: "Developing advanced NLP models specifically optimized for educational content and syllabus-based responses."
    },
    {
      role: "Educational Technology",
      description: "Understanding institutional needs and creating user-friendly interfaces for both administrators and students."
    },
    {
      role: "Data Security",
      description: "Ensuring enterprise-grade security and compliance for educational institutions of all sizes."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2">About Acadira</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Empowering Education with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Acadira by Xovaxy is revolutionizing how educational institutions 
              provide personalized AI tutoring aligned with their specific curriculum.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <Card className="gradient-card border-0 shadow-feature">
              <CardContent className="p-8 text-center space-y-6">
                <div className="text-4xl">🎓</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Vision</h2>
                <p className="text-lg text-muted-foreground">
                  "Empowering education with AI tailored for every institution"
                </p>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We envision a world where every student has access to a personalized AI tutor 
                  that understands their exact curriculum and helps them excel in their studies.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-feature">
              <CardContent className="p-8 text-center space-y-6">
                <div className="text-4xl">🚀</div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Story</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Acadira was created to solve a critical problem in education: students were using 
                  generic AI chatbots that often provided irrelevant or incorrect information not 
                  aligned with their syllabus. We built Acadira to ensure students learn with 
                  accurate, syllabus-specific AI tutors instead of generic chatbots.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Acadira.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="gradient-card border-0 shadow-soft hover:shadow-card transition-smooth">
                <CardContent className="p-6 space-y-4">
                  <div className="text-3xl">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dedicated experts working to transform educational technology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="gradient-card border-0 shadow-soft text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold text-lg">
                      {member.role.split(' ').map(word => word[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">{member.role}</h3>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Xovaxy */}
      <section className="py-16 bg-gradient-feature">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Powered by Xovaxy
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Acadira is proudly developed under Xovaxy, ensuring enterprise-grade 
                reliability, security, and innovation in educational technology.
              </p>
            </div>
            
            <Card className="gradient-card border-0 shadow-card">
              <CardContent className="p-8 space-y-6">
                <div className="text-4xl">⚡</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Xovaxy Technologies</h3>
                  <p className="text-muted-foreground">
                    A technology company focused on building AI-powered solutions 
                    that solve real-world problems in education, productivity, and innovation.
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AI Innovation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Enterprise Solutions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Educational Focus</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join the educational institutions already using Acadira to provide 
                their students with curriculum-aligned AI tutoring.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button variant="hero" size="lg">
                  Book a Demo
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
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

export default About;