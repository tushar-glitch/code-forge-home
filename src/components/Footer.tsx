import { FooterContent } from "@/components/ui/FooterContent";
import { FooterBottom } from "@/components/ui/FooterBottom";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 box-border caret-transparent border-gray-200 py-16 border-t border-solid">
      <div className="box-border caret-transparent max-w-screen-xl mx-auto px-6 md:px-8">
        <FooterContent />
        <FooterBottom />
      </div>
    </footer>
  );
};
