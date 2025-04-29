
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
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

  const faqs = [
    {
      question: "How does CodeProbe differ from traditional technical interviews?",
      answer:
        "CodeProbe focuses on real-world coding tasks instead of algorithm puzzles. Candidates work on practical problems in a complete development environment with access to documentation and tools they'd normally use—just like they would in an actual job.",
    },
    {
      question: "What programming languages and frameworks do you support?",
      answer:
        "We support all major programming languages and frameworks including JavaScript/TypeScript (React, Vue, Angular, Node.js), Python (Django, Flask), Java, Ruby, Go, PHP, and more. If you use a specific tech stack, we can customize assessments for it.",
    },
    {
      question: "How does the AI assistant work? Doesn't it just help candidates cheat?",
      answer:
        "The AI assistant functions similarly to tools like GitHub Copilot that developers use daily in real work environments. Our platform doesn't measure whether candidates can solve problems without help—it measures how effectively they can solve problems with the tools available to modern developers.",
    },
    {
      question: "Can I create custom assessments specific to my company's needs?",
      answer:
        "Absolutely! You can create fully customized assessments based on your actual codebase (with sensitive parts removed). Alternatively, you can choose from our library of templates and modify them to match your requirements.",
    },
    {
      question: "How long does a typical assessment take?",
      answer:
        "Most assessments take between 1-2 hours, but you can configure them to be as short as 30 minutes or as long as several days, depending on the complexity of tasks and your hiring process.",
    },
    {
      question: "What kind of analytics and insights do you provide?",
      answer:
        "Our platform provides detailed analytics including time spent on tasks, approach to problem-solving, code quality metrics, refactoring patterns, and even communication style with the AI assistant. You'll get a comprehensive view of how candidates think and work.",
    },
  ];

  return (
    <section id="faq" className="py-24" ref={sectionRef}>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 reveal">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground reveal animation-delay-200">
            Everything you need to know about our platform
          </p>
        </div>

        <div className="space-y-4 reveal animation-delay-400">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center reveal animation-delay-600">
          <p className="text-muted-foreground mb-2">
            Still have questions?
          </p>
          <a 
            href="#contact" 
            className="text-primary hover:text-primary/80 font-medium"
          >
            Contact our team for more information
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
