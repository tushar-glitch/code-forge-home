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
            All the answers to start collecting your feedback today.
            <strong className="font-bold box-border caret-transparent">
              {" "}
              30-second installation guaranteed.
            </strong>
          </p>
          <a
            href="mailto://contact@feedbask.com"
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
          <FAQItem question="How long does installation take?" />
          <FAQItem question="Is there a free plan?" />
          <FAQItem question="What types of feedback can I collect?" />
          <FAQItem question="Can I customize the widget's appearance?" />
          <FAQItem question="Does it work on mobile?" />
          <FAQItem question="What are the settings available for the widget?" />
          <FAQItem question="What kind of analytics do you provide?" />
        </div>
      </div>
    </section>
  );
};
