import { TestimonialCard } from "@/components/ui/TestimonialCard";

export const TestimonialsSection = () => {
  return (
    <section className="bg-[linear-gradient(rgb(249,250,251),rgb(255,255,255))] box-border caret-transparent py-20">
      <div className="box-border caret-transparent w-full mx-auto px-8">
        <div className="box-border caret-transparent text-center mb-16">
          <h2 className="text-3xl font-semibold box-border caret-transparent tracking-[-0.75px] leading-9 mb-4 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
            What people say about Feedbask
          </h2>
        </div>
        <div className="box-border caret-transparent columns-1 gap-x-8 gap-y-8 md:columns-3">
          <TestimonialCard
            href="https://www.uneed.best/tool/feedbask?tab=comments"
            cardVariant="mb-8"
            platformLogo="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/uneed-logo.png"
            platformLogoAlt="Uneed"
            platformLogoVariant="backdrop-blur-sm bg-white/90 border border-gray-200 border-solid"
            platformName="Uneed"
            platformNameVariant="text-gray-600"
            starIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-22.svg"
            quoteIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-23.svg"
            testimonialText="5 Star Best app to collect feedback"
            authorProfileImage="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/uQd7xQ0F_400x400.jpg"
            authorProfileImageAlt="Hasan-Toor's profile picture"
            authorName="Hasan-Toor"
          />
          <TestimonialCard
            href="https://www.uneed.best/tool/feedbask?tab=comments"
            cardVariant="mt-8"
            platformLogo="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/uneed-logo.png"
            platformLogoAlt="Uneed"
            platformLogoVariant="backdrop-blur-sm bg-white/90 border border-gray-200 border-solid"
            platformName="Uneed"
            platformNameVariant="text-gray-600"
            starIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-22.svg"
            quoteIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-23.svg"
            testimonialText="I'm an early user. And already really happy with it! Such an easy way to get user feedback."
            authorProfileImage="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/florriandarroman.jpg"
            authorProfileImageAlt="florriandarroman's profile picture"
            authorName="florriandarroman"
          />
          <TestimonialCard
            href="https://www.uneed.best/tool/feedbask?tab=comments"
            cardVariant="mb-8"
            platformLogo="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/uneed-logo.png"
            platformLogoAlt="Uneed"
            platformLogoVariant="backdrop-blur-sm bg-white/90 border border-gray-200 border-solid"
            platformName="Uneed"
            platformNameVariant="text-gray-600"
            starIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-22.svg"
            quoteIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-23.svg"
            testimonialText="As a first time user, I'm very happy with the app"
            authorProfileImage="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/neel-das.jpg"
            authorProfileImageAlt="Neel Das's profile picture"
            authorName="Neel Das"
          />
          <TestimonialCard
            href="https://www.uneed.best/tool/feedbask?tab=comments"
            cardVariant="mt-8"
            platformLogo="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/uneed-logo.png"
            platformLogoAlt="Uneed"
            platformLogoVariant="backdrop-blur-sm bg-white/90 border border-gray-200 border-solid"
            platformName="Uneed"
            platformNameVariant="text-gray-600"
            starIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-22.svg"
            quoteIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-23.svg"
            testimonialText="I was looking for a tool like Feedbask and I am so lucky to find just that, a tool that makes it super duper easy to collect user feedback. Feedbask is really quick & easy to setup although it helps if you have a little bit of technical knowledge as you'd need to add widget code on your website. Highly recommend to saas founders to have this in their toolkit."
            authorProfileImage="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/neel-das.jpg"
            authorProfileImageAlt="Neel Das's profile picture"
            authorName="Neel Das"
          />
          <TestimonialCard
            href="https://twitter.com/NicolasCdev/status/1715400000000000000"
            cardVariant="mb-8"
            platformLogo="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/twitter-logo.png"
            platformLogoAlt="Twitter"
            platformLogoVariant="backdrop-blur-sm bg-white/90 border border-gray-200 border-solid"
            platformName="Twitter"
            platformNameVariant="text-gray-600"
            starIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-22.svg"
            quoteIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-23.svg"
            testimonialText="Hier j'ai intégré Feedbask, le tool de @Pauline_Cx, dans mon dernier SaaS. C'est un outil pour : - récupérer des feedback utilisateur - faire remonter des bugs Etc... Intégration ultra simple Super customisation Onboarding impeccable. Aujourd'hui je reçois le premier retour"
            authorProfileImage="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/nicolas-c-dev.jpg"
            authorProfileImageAlt="Nicolas C Dev's profile picture"
            authorName="Nicolas C Dev"
          />
        </div>
      </div>
    </section>
  );
};
