import { HeroContent } from "@/components/ui/HeroContent";

export const HeroSection = () => {
  return (
    <section className="relative box-border caret-transparent pb-10">
      <div className="absolute box-border caret-transparent blur-3xl -z-10 overflow-hidden -top-40 inset-x-0 md:-top-80">
        <div className="relative aspect-[1155_/_678] bg-[linear-gradient(to_right_top,rgb(255,128,181),rgb(144,137,252))] box-border caret-transparent left-[calc(50%_-_176px)] opacity-20 translate-x-[-289px] rotate-[30.00001156757613deg] w-[578px] md:left-[calc(50%_-_480px)] md:translate-x-[-577.5px] md:rotate-[30.00001156757613deg] md:w-[1155px]"></div>
      </div>
      <div className="box-border caret-transparent w-full mx-auto px-8">
        <HeroContent />
      </div>
    </section>
  );
};
