import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-accent/20 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Acadira – The AI Tutor Built for{" "}
                <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  Your Curriculum
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Give your students a 24/7 syllabus-aligned AI tutor and simplify learning. 
                Transform your curriculum into an intelligent teaching assistant.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/demo">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Book a Demo
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Subscribe Now
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Curriculum-Aligned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative gradient-card rounded-2xl p-8 shadow-feature">
              <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground">AI Tutor Preview</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 gradient-hero rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent rounded-full opacity-30 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;