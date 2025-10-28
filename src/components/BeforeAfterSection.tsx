import { BeforeAfterCards } from "@/components/ui/BeforeAfterCards";

export const BeforeAfterSection = () => {
  return (
    <section className="bg-[linear-gradient(rgb(255,255,255),rgb(249,250,251))] box-border caret-transparent py-20">
      <div className="box-border caret-transparent w-full mx-auto px-4 md:px-6">
        <div className="box-border caret-transparent text-center mb-16">
          <h2 className="text-3xl font-semibold box-border caret-transparent tracking-[-0.75px] leading-9 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
            Why we're{" "}
            <span className="text-violet-500 text-3xl box-border caret-transparent tracking-[-0.75px] leading-9 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
              different
            </span>
          </h2>
        </div>
        <BeforeAfterCards />
        <div className="box-border caret-transparent text-center mt-12">
          <p className="text-gray-700 text-lg font-medium box-border caret-transparent leading-7 mb-6">
            We believe technical interviews should evaluate candidates on the skills they'll
            actually use day-to-day, not their ability to memorize algorithms.
          </p>
          <a
            href="/get-started"
            className="text-white font-medium items-center bg-violet-500 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_4px_6px_-1px,rgba(0,0,0,0.1)_0px_2px_4px_-2px] box-border caret-transparent inline-flex justify-center px-6 py-3 rounded-[10.4px] hover:bg-violet-500/90"
          >
            Try it for free
          </a>
        </div>
      </div>
    </section>
  );
};
