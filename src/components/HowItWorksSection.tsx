
import { useEffect, useRef } from "react";
import { Code, MonitorPlay, Users, BarChart } from "lucide-react";

const HowItWorksSection = () => {
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

  const steps = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Create challenges",
      description:
        "Design real-world challenges based on your actual codebase and the skills you need. Upload projects, create bug fixes, or feature implementations.",
    },
    {
      icon: <MonitorPlay className="h-6 w-6" />,
      title: "Invite candidates",
      description:
        "Send unique links to your candidates. They'll access a fully functional in-browser IDE with your predefined project and instructions.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Observe & collaborate",
      description:
        "Watch candidates solve problems in real-time or review their work later. Candidates can use the AI assistant just like they would use GitHub Copilot.",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Analyze performance",
      description:
        "Get detailed analytics on problem-solving approaches, code quality, and efficiency. Compare candidates objectively based on real skills.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 bg-background relative"
      ref={sectionRef}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto reveal animation-delay-200">
            Our platform provides an end-to-end solution for assessing developer skills
            through practical, real-world coding challenges
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-accent/50 transform -translate-x-1/2 z-0"></div>

          <div className="space-y-20 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`reveal ${
                  index % 2 === 0 ? "animation-delay-200" : "animation-delay-400"
                }`}
              >
                <div
                  className={`flex flex-col ${
                    index % 2 === 0
                      ? "md:flex-row"
                      : "md:flex-row-reverse"
                  } items-center gap-8`}
                >
                  <div className="md:w-1/2 flex flex-col items-center md:items-start md:pr-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        {step.icon}
                      </div>
                      <div className="text-xl md:text-2xl font-semibold">{step.title}</div>
                    </div>
                    <p className="text-muted-foreground text-center md:text-left">{step.description}</p>
                  </div>

                  <div className="md:w-1/2 md:pl-8">
                    <div className="aspect-video rounded-lg bg-card border border-border p-4 shadow-lg">
                      <div className="h-full bg-secondary/30 rounded flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">Step {index + 1} Illustration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
