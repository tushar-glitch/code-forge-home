import { FooterBrand } from "@/components/ui/FooterBrand";
import { FooterColumn } from "@/components/ui/FooterColumn";

export const FooterContent = () => {
  return (
    <div className="box-border caret-transparent gap-x-10 grid grid-cols-[repeat(1,minmax(0px,1fr))] gap-y-10 md:grid-cols-[repeat(5,minmax(0px,1fr))]">
      <FooterBrand />
      <FooterColumn
        title="Feedbask"
        links={[
          { href: "mailto://contact@feedbask.com", text: "Contact" },
          { href: "/#pricing", text: "Pricing" },
          {
            href: "https://feedbask-roadmap.feedbask.com/",
            text: "Our roadmap",
          },
          {
            href: "https://www.refindie.com/register/201/feedbask",
            text: "Become an affiliate (30% commission)",
          },
          { href: "/docs", text: "Docs" },
          { href: "/blog", text: "Blog" },
          {
            href: "https://www.feedbask.com/categories/features",
            text: "Categories",
          },
          { href: "/alternatives", text: "All alternatives" },
        ]}
      />
      <FooterColumn
        title="Feature"
        links={[
          {
            href: "/product/website-feedback-widget",
            text: "Website Feedback Widget",
          },
          {
            href: "/product/in-app-feedback-widget",
            text: "In‑App Feedback Widget",
          },
          { href: "/product/feature-voting-tool", text: "Feature Voting Tool" },
          {
            href: "/product/public-roadmap-software",
            text: "Public Roadmap Software",
          },
          { href: "/product/testimonials-widget", text: "Testimonials Widget" },
          { href: "/product/bug-report-widget", text: "Bug Report Widget" },
        ]}
      />
      <FooterColumn
        title="Alternative to"
        links={[
          { href: "/alternatives/featurebase", text: "Featurebase" },
          { href: "/alternatives/beamer", text: "Beamer" },
          { href: "/alternatives/canny", text: "Canny" },
          { href: "/alternatives/upvoty", text: "Upvoty" },
          { href: "/alternatives/usersvoice", text: "Usersvoice" },
          { href: "/alternatives/typeform", text: "Typeform" },
          { href: "/alternatives/clickup", text: "Clickup" },
        ]}
      />
      <FooterColumn
        title="Founders Team"
        links={[
          { href: "https://x.com/tarunyadav9761", text: "Tarun Yadav" },
          { href: "https://x.com/Pauline_Cx", text: "Pauline Clavelloux" },
        ]}
        secondaryTitle="You might also like"
        secondaryLinks={[
          { href: "https://www.refindie.com/", text: "Refindie" },
          { href: "https://rocketmvp.com/", text: "Rocket MVP" },
        ]}
      />
    </div>
  );
};
