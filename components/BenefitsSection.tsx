import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BenefitsSection = () => {
  const benefits = [
    {
      category: "For Institutions",
      icon: "🏫",
      color: "bg-blue-100 text-blue-800",
      features: [
        "Complete admin control over curriculum",
        "Private AI tutor for your students",
        "Detailed usage analytics and insights",
        "Secure data with institutional privacy",
        "Curriculum-specific knowledge base"
      ]
    },
    {
      category: "For Students", 
      icon: "🎓",
      color: "bg-green-100 text-green-800",
      features: [
        "Instant syllabus-based answers",
        "24/7 learning support available",
        "Personalized study assistant",
        "No distractions from external content",
        "Interactive quiz generation"
      ]
    },
    {
      category: "For Parents",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-purple-100 text-purple-800", 
      features: [
        "Complete transparency in learning",
        "Trusted curriculum-based tutoring",
        "Safe learning environment",
        "Progress tracking and insights",
        "Institution-verified content only"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">Key Benefits</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Benefits for Everyone in the Education Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Acadira creates value for institutions, students, and parents through 
            curriculum-aligned AI tutoring that maintains educational integrity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="gradient-card border-0 shadow-card hover:shadow-feature transition-all duration-300">
              <CardHeader className="text-center space-y-4">
                <div className="text-4xl mb-2">{benefit.icon}</div>
                <CardTitle className="text-xl font-semibold">{benefit.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefit.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;