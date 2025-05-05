
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
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

  const testimonials = [
    {
      quote:
        "Hire10xdevs has completely transformed our hiring process. We're able to evaluate candidates' real-world skills in a way that traditional interviews simply couldn't match.",
      name: "Sarah Johnson",
      title: "CTO, TechGrowth",
      avatar: "SJ",
    },
    {
      quote:
        "The quality of engineers we've hired since implementing Hire10xdevs has increased dramatically. The platform lets us see exactly how candidates think and solve problems.",
      name: "Michael Chen",
      title: "Engineering Manager, DevScale",
      avatar: "MC",
    },
    {
      quote:
        "We've reduced our time-to-hire by 40% while simultaneously improving the quality of our technical assessments. The AI assistant feature is genuinely innovative.",
      name: "Rachel Williams",
      title: "Head of Talent, FutureStack",
      avatar: "RW",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section
      id="testimonials"
      className="py-24 bg-[#0A1122] relative"
      ref={sectionRef}
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 right-20 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            What our <span className="gradient-text">customers say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto reveal animation-delay-200">
            Companies across the tech industry are transforming their hiring process with Hire10xdevs
          </p>
        </div>

        <div className="max-w-4xl mx-auto reveal animation-delay-400">
          <div className="relative py-8">
            {/* Testimonial */}
            <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-semibold text-primary">
                  {testimonials[currentIndex].avatar}
                </div>

                <div className="flex-1">
                  <svg
                    className="h-8 w-8 text-primary/30 mb-4"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>

                  <p className="text-lg mb-6">{testimonials[currentIndex].quote}</p>

                  <div>
                    <p className="font-semibold">{testimonials[currentIndex].name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].title}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-primary/20"
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
