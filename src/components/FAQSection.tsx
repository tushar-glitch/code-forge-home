import { FAQItem } from "@/components/ui/FAQItem";

export const FAQSection = () => {
  return (
    <section className="box-border caret-transparent py-20">
      <div className="items-start box-border caret-transparent gap-x-10 flex flex-col gap-y-10 w-full mx-auto px-8 md:flex-row">
        <div className="items-start box-border caret-transparent gap-x-3 flex flex-col gap-y-3">
          <div className="box-border caret-transparent gap-x-2 flex flex-col gap-y-2">
            <span className="text-violet-500 font-bold box-border caret-transparent block">
              FAQ
            </span>
            <h2 className="text-3xl font-semibold box-border caret-transparent tracking-[-0.75px] leading-9 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-gray-500 text-lg box-border caret-transparent basis-[0%] grow leading-7 max-w-2xl mt-2">
            Everything you need to know about our platform
          </p>
          <a
            href="mailto://contact@hire10xdevs.com"
            className="text-gray-50 text-sm font-semibold items-center bg-violet-500 box-border caret-transparent gap-x-2 flex h-10 justify-center leading-5 gap-y-2 text-nowrap mt-4 px-4 py-2 rounded-[8.4px] hover:bg-violet-500/90"
          >
            <img
              src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-38.svg"
              alt="Icon"
              className="box-border caret-transparent shrink-0 h-4 pointer-events-none text-nowrap w-4"
            />
            Contact us
          </a>
        </div>
        <div className="box-border caret-transparent gap-x-0 grid grid-cols-[repeat(1,minmax(0px,1fr))] gap-y-4 basis-[0%] grow">
          <FAQItem question="How does Hire10xdevs differ from traditional technical interviews?" answer="Hire10xdevs focuses on real-world coding tasks instead of algorithm puzzles. Candidates work on practical problems in a complete development environment with access to documentation and tools they'd normally use—just like they would in an actual job." />
          <FAQItem question="What programming languages and frameworks do you support?" answer="We support all major programming languages and frameworks including JavaScript/TypeScript (React, Vue, Angular, Node.js), Python (Django, Flask), Java, Ruby, Go, PHP, and more. If you use a specific tech stack, we can customize assessments for it." />
          <FAQItem question="How does the AI assistant work? Doesn't it just help candidates cheat?" answer="The AI assistant functions similarly to tools like GitHub Copilot that developers use daily in real work environments. Our platform doesn't measure whether candidates can solve problems without help—it measures how effectively they can solve problems with the tools available to modern developers." />
          <FAQItem question="Can I create custom assessments specific to my company's needs?" answer="Absolutely! You can create fully customized assessments based on your actual codebase (with sensitive parts removed). Alternatively, you can choose from our library of templates and modify them to match your requirements." />
          <FAQItem question="How long does a typical assessment take?" answer="Most assessments take between 1-2 hours, but you can configure them to be as short as 30 minutes or as long as several days, depending on the complexity of tasks and your hiring process." />
          <FAQItem question="What kind of analytics and insights do you provide?" answer="Our platform provides detailed analytics including time spent on tasks, approach to problem-solving, code quality metrics, refactoring patterns, and even communication style with the AI assistant. You'll get a comprehensive view of how candidates think and work." />
        </div>
      </div>
    </section>
  );
};