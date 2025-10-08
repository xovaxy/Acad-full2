import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border text-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/favicon.jpg" 
                alt="Acadira Logo" 
                className="w-10 h-10 rounded-lg object-contain bg-white p-1"
              />
              <span className="text-xl font-bold">Acadira</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered curriculum-specific tutoring platform for educational institutions.
            </p>
            <div className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-primary">Xovaxy</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <div className="space-y-2 text-sm">
              <Link to="/how-it-works" className="block text-muted-foreground hover:text-primary transition-smooth">
                How It Works
              </Link>
              <Link to="/features" className="block text-muted-foreground hover:text-primary transition-smooth">
                Features
              </Link>
              <Link to="/pricing" className="block text-muted-foreground hover:text-primary transition-smooth">
                Pricing
              </Link>
              <Link to="/demo" className="block text-muted-foreground hover:text-primary transition-smooth">
                Request Demo
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-smooth">
                About Us
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-smooth">
                Contact
              </Link>
              <a href="https://instagram.com/xovaxy.ai" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-smooth">
                Instagram
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Access</h3>
            <div className="space-y-2 text-sm">
              <Link to="/login" className="block text-muted-foreground hover:text-primary transition-smooth">
                Institution Login
              </Link>
              <Link to="/student-login" className="block text-muted-foreground hover:text-primary transition-smooth">
                Student Login
              </Link>
              <Link to="/admin-dashboard" className="block text-muted-foreground hover:text-primary transition-smooth">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Acadira by Xovaxy. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-smooth">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-smooth">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;