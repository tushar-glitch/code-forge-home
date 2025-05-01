
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const WhyDifferentSection = () => {
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
    <section 
      className="py-24 relative overflow-hidden" 
      ref={sectionRef}
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-red-500/20 text-red-500 p-2 rounded-md">DSA</div>
                  <div className="text-sm text-muted-foreground">Traditional Technical Interview</div>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <p className="text-muted-foreground italic text-sm">
                    "Implement a function to reverse a binary tree..."
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <p className="text-muted-foreground italic text-sm">
                    "What's the time complexity of quicksort in the worst case?"
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <p className="text-muted-foreground italic text-sm">
                    "Solve this dynamic programming problem on a whiteboard..."
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-red-400">
                  ✗ Tests memorization, not real-world skills
                </p>
                <p className="text-sm text-red-400">
                  ✗ High stress, artificial environment
                </p>
                <p className="text-sm text-red-400">
                  ✗ Biased against self-taught developers
                </p>
              </div>
            </div>
          </div>

          <div className="reveal animation-delay-400">
            <div className="bg-card border border-primary/20 rounded-lg p-6 shadow-lg relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full"></div>
              <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-accent/10 rounded-full"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 text-primary p-2 rounded-md">hire10xdevs</div>
                  <div className="text-sm text-muted-foreground">Real-world Assessment</div>
                </div>
                <div className="border-l-2 border-primary/30 pl-4">
                  <p className="text-muted-foreground italic text-sm">
                    "Debug this React component that's not updating correctly..."
                  </p>
                </div>
                <div className="border-l-2 border-primary/30 pl-4">
                  <p className="text-muted-foreground italic text-sm">
                    "Implement this feature according to the requirements..."
                  </p>
                </div>
                <div className="border-l-2 border-primary/30 pl-4">
                  <p className="text-muted-foreground italic text-sm">
                    "Optimize this API endpoint that's running slowly..."
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-primary/20">
                <p className="text-sm text-accent">
                  ✓ Evaluates practical development skills
                </p>
                <p className="text-sm text-accent">
                  ✓ Realistic environment with tools and resources
                </p>
                <p className="text-sm text-accent">
                  ✓ Focuses on problem-solving, not memorization
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center reveal animation-delay-600">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why we're <span className="gradient-text">different</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We believe technical interviews should evaluate candidates on the skills they'll
            actually use day-to-day, not their ability to memorize algorithms.
          </p>
          <Button size="lg">
            Try it for free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
