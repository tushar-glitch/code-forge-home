
import { useEffect, useRef } from "react";
import { 
  Code, 
  Headphones, 
  Database, 
  Monitor, 
  BarChart, 
  Shield, 
  Zap, 
  BookOpen 
} from "lucide-react";

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const features = [
    {
      icon: <Monitor className="h-6 w-6" />,
      title: "In-Browser IDE",
      description:
        "Full-featured development environment directly in the browser with support for popular frameworks and languages.",
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "AI Assistant",
      description:
        "AI-powered helper that provides guidance similar to GitHub Copilot but tailored to assessment scenarios.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Project-Based Tests",
      description:
        "Realistic coding scenarios based on actual development tasks rather than abstract algorithms.",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Detailed Analytics",
      description:
        "Comprehensive metrics on candidate performance, approach, and problem-solving methodology.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Template Library",
      description:
        "Ready-made assessment templates across various tech stacks and difficulty levels.",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Documentation Tools",
      description:
        "Evaluate how candidates read, understand and implement features from documentation.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Anti-Cheating Measures",
      description:
        "Sophisticated plagiarism detection and session monitoring to ensure assessment integrity.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Setup",
      description:
        "Start creating assessments in minutes with our intuitive interface and pre-configured environments.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#0A1122] relative" ref={sectionRef}>
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            Powerful <span className="gradient-text">features</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto reveal animation-delay-200">
            Our platform provides all the tools needed to create realistic coding
            assessments and evaluate candidates effectively
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 reveal`}
              style={{ animationDelay: `${(index % 4) * 200}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
