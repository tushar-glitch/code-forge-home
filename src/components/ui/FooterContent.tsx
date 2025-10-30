import { FooterBrand } from "@/components/ui/FooterBrand";
import { FooterColumn } from "@/components/ui/FooterColumn";

export const FooterContent = () => {
  return (
    <div className="box-border caret-transparent gap-x-10 grid grid-cols-[repeat(1,minmax(0px,1fr))] gap-y-10 md:grid-cols-[repeat(3,minmax(0px,1fr))]">
      <FooterBrand />
      <FooterColumn
        title="Product"
        links={[
          { href: "#features", text: "Features" },
          { href: "#pricing", text: "Pricing" },
          { href: "#how-it-works", text: "How it works" },
          { href: "#testimonials", text: "Testimonials" },
        ]}
      />
      <FooterColumn
        title="Resources"
        links={[
          { href: "#blog", text: "Blog" },
          { href: "#docs", text: "Documentation" },
          { href: "#support", text: "Support" },
          { href: "#faq", text: "FAQ" },
        ]}
      />
    </div>
  );
};