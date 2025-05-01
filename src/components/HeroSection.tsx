
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Code, CheckCircle } from "lucide-react";

const HeroSection = () => {
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

  return (
    <section ref={sectionRef} className="hero-gradient min-h-screen pt-24 flex items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-20 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 reveal">
              <div className="bg-primary/20 p-2 rounded-full">
                <Code className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-primary font-medium">Technical hiring reimagined</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight reveal animation-delay-200">
              Hire developers based on <span className="gradient-text">real skills</span>, not algorithms
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground reveal animation-delay-400">
              Evaluate candidates using real-world projects, debugging tasks, and feature implementations in live coding environments, just like your actual work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-2 reveal animation-delay-600">
              <Button size="lg" className="gap-2">
                Get Started
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Button>
              <Button variant="outline" size="lg">
                Request Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-6 mt-4 reveal animation-delay-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-sm">Realistic assessments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-sm">In-browser IDE</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span className="text-sm">AI-powered assistance</span>
              </div>
            </div>
          </div>
          
          <div className="relative reveal animation-delay-400">
            <div className="rounded-lg bg-card p-1 border border-border shadow-xl">
              <div className="bg-secondary rounded-md p-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-muted-foreground">Interview Challenge - React Bug Fix</div>
              </div>
              <div className="p-4 font-mono text-sm overflow-hidden">
                <pre className="text-accent-foreground"><code>{`function App() {
  const [count, setCount] = useState(0);
  
  // Bug: This doesn't update the UI
  function handleClick() {
    count = count + 1;
  }
  
  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={handleClick}>
        Increment
      </button>
    </div>
  );
}`}</code></pre>
              </div>
              <div className="border-t border-border p-3 flex items-center gap-3">
                <div className="bg-primary/20 p-1.5 rounded-full">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3.5V2m0 1.5v1m0 0v10a2 2 0 0 0 2 2h0c.74 0 1.395-.336 1.832-.86l.166-.21A2 2 0 0 1 14.83 5h2.17c0-.25-.134-.48-.359-.609l-5-2.857a1 1 0 0 0-.982 0l-5 2.857A.658.658 0 0 0 5 5"></path>
                  </svg>
                </div>
                <div className="text-sm text-muted-foreground">AI Assistant: "I see the issue. You need to use <span className="text-accent">setCount(count + 1)</span> instead of direct assignment."</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-lg bg-gradient-to-br from-primary/50 to-accent/50 blur-lg opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
