import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import acadiraLogo from "@/assets/acadira-logo.jpg";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={acadiraLogo} alt="Acadira" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-xl font-bold text-foreground">Acadira</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              How It Works
            </Link>
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="cta" size="sm">
                Book Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;