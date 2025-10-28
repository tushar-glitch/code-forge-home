import { FeaturesTabs } from "@/components/ui/FeaturesTabs";
import { FeaturesCarousel } from "@/components/ui/FeaturesCarousel";

export const FeaturesSection = () => {
  return (
    <section className="bg-[linear-gradient(to_right_bottom,rgb(249,250,251),rgb(255,255,255),rgb(249,250,251))] box-border caret-transparent py-20">
      <div className="box-border caret-transparent w-full mx-auto px-4">
        <div className="box-border caret-transparent text-center mb-16">
          <h2 className="text-3xl font-semibold box-border caret-transparent tracking-[-0.75px] leading-9 mb-4 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
            One platform to handle your feedback
          </h2>
          <p className="text-gray-500 text-xl box-border caret-transparent leading-7 max-w-screen-md mx-auto">
            Explore our key features through real screenshots of the platform
          </p>
        </div>
        <div className="box-border caret-transparent max-w-screen-xl mx-auto">
          <FeaturesTabs />
          <FeaturesCarousel />
        </div>
      </div>
    </section>
  );
};
