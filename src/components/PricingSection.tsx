import { PricingCard } from "@/components/ui/PricingCard";

export const PricingSection = () => {
  return (
    <section className="box-border caret-transparent py-20">
      <div className="items-center box-border caret-transparent gap-x-6 flex flex-col gap-y-6 w-full mx-auto px-8">
        <div className="box-border caret-transparent gap-x-2 flex flex-col gap-y-2">
          <span className="text-violet-500 font-bold box-border caret-transparent block text-center">
            Pricing
          </span>
          <h2 className="text-3xl font-semibold box-border caret-transparent tracking-[-0.75px] leading-9 max-w-2xl text-center md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
            Simple, transparent pricing
          </h2>
        </div>
        <p className="text-gray-500 text-lg box-border caret-transparent leading-7 max-w-lg text-center md:text-xl">
          Start collecting feedback for free. Upgrade as your needs grow.
        </p>
        <div className="box-border caret-transparent gap-x-5 grid grid-cols-[repeat(1,minmax(0px,1fr))] gap-y-5 w-full mt-7 mx-auto md:grid-cols-[repeat(2,minmax(0px,1fr))]">
          <PricingCard
            planName="Free"
            price="Free"
            priceSuffix="forever"
            description="For businesses that just started"
            features={[
              "1 project",
              "Collect up to 20 Responses",
              "Collect up to 20 Bug Reports",
              "Collect up to 20 Feature Requests",
              "Public roadmap page",
              "Live chat with 3 days history",
            ]}
            buttonText="Get Started"
            buttonHref="/auth?redirect=pricing"
            buttonVariant=""
          />
          <PricingCard
            planName="Pro"
            badge={{
              text: "Launching deal",
              iconUrl: "https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-34.svg",
            }}
            price="$49"
            originalPrice="$69"
            priceSuffix="/month"
            description="For businesses that want to grow"
            features={[
              "2 Included projects",
              "Unlimited active widgets",
              "Collect Unlimited feedback",
              "Full live chat history",
              "Invite team members",
              "Public roadmap page",
              "Remove branding option",
              "Webhook access",
              "Priority email support",
            ]}
            additionalInfo="+ $15/mo per additional project"
            buttonText="Get Started"
            buttonHref="/auth?redirect=pricing"
            buttonVariant=""
          />
        </div>
      </div>
    </section>
  );
};
