import { HeroSection } from "@/components/HeroSection";
import { BeforeAfterSection } from "@/components/BeforeAfterSection";
import { VideoSection } from "@/components/VideoSection";
import { ModulesSection } from "@/components/ModulesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";

const Index = () => {
  return (
    <div className="box-border caret-transparent">
      <HeroSection />
      <BeforeAfterSection />
      <VideoSection />
      <ModulesSection />
      <TestimonialsSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default Index;
