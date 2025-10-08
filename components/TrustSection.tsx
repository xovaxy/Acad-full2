import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TrustSection = () => {
  const trustIndicators = [
    {
      icon: "🔒",
      title: "Data Security",
      description: "Enterprise-grade encryption and security protocols protect your institutional data."
    },
    {
      icon: "✅",
      title: "Compliance Ready", 
      description: "Built with educational compliance standards and privacy regulations in mind."
    },
    {
      icon: "⚡",
      title: "Reliable Infrastructure",
      description: "99.9% uptime with scalable cloud infrastructure supporting thousands of students."
    },
    {
      icon: "🎯",
      title: "Curriculum Focused",
      description: "AI responses strictly limited to your uploaded curriculum - no external content."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2">Powered by Xovaxy</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Trusted by Educational Institutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Acadira is developed by <span className="font-semibold text-primary">Xovaxy</span>, 
            ensuring enterprise-grade reliability, security, and educational compliance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustIndicators.map((indicator, index) => (
            <Card key={index} className="gradient-card border-0 shadow-soft hover:shadow-card transition-smooth text-center">
              <CardContent className="p-6 space-y-4">
                <div className="text-3xl">{indicator.icon}</div>
                <h3 className="font-semibold text-foreground">{indicator.title}</h3>
                <p className="text-sm text-muted-foreground">{indicator.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>GDPR Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;