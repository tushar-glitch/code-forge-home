
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthButton from "./AuthButton";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="text-2xl font-bold gradient-text cursor-pointer" 
              onClick={() => navigate("/")}
            >
              CodeProbe
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <AuthButton />
            <Button variant="default" size="lg" onClick={() => navigate("/get-started")}>
              Get Started
            </Button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <NavLink href="#features" mobile>Features</NavLink>
            <NavLink href="#how-it-works" mobile>How it works</NavLink>
            <NavLink href="#testimonials" mobile>Testimonials</NavLink>
            <NavLink href="#faq" mobile>FAQ</NavLink>
            <div className="flex flex-col gap-2 mt-4">
              <AuthButton />
              <Button variant="default" size="sm" className="w-full" onClick={() => navigate("/get-started")}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}

const NavLink = ({ href, children, mobile }: NavLinkProps) => {
  return (
    <a
      href={href}
      className={`text-foreground/80 hover:text-foreground transition-colors duration-200 ${
        mobile ? "py-2" : ""
      }`}
    >
      {children}
    </a>
  );
};

export default NavBar;
