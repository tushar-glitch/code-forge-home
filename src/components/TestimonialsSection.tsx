import { TestimonialCard } from "@/components/ui/TestimonialCard";

export const TestimonialsSection = () => {
  return (
    <section className="bg-[linear-gradient(rgb(249,250,251),rgb(255,255,255))] box-border caret-transparent py-20">
      <div className="box-border caret-transparent w-full mx-auto px-8">
        <div className="box-border caret-transparent text-center mb-16">
          <h2 className="text-3xl font-semibold box-border caret-transparent tracking-[-0.75px] leading-9 mb-4 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
            What our <span className="text-violet-500 text-3xl box-border caret-transparent tracking-[-0.75px] leading-9 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
              customers say
            </span>
          </h2>
        </div>
        <div className="box-border caret-transparent columns-1 gap-x-8 gap-y-8 md:columns-3">
          <TestimonialCard
            href="#"
            cardVariant="mb-8"
            platformName="Tech Solutions Inc."
            platformNameVariant="text-gray-600"
            starIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-22.svg"
            quoteIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-23.svg"
            testimonialText="Hire10xdevs has completely transformed our hiring process. We're able to evaluate candidates' real-world skills in a way that traditional interviews simply couldn't match."
            authorProfileImage="https://via.placeholder.com/40/FF0000/FFFFFF?text=SJ"
            authorProfileImageAlt="Sarah Johnson's profile picture"
            authorName="Sarah Johnson"
          />
          <TestimonialCard
            href="#"
            cardVariant="mt-8"
            platformName="Innovate Corp."
            platformNameVariant="text-gray-600"
            starIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-22.svg"
            quoteIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-23.svg"
            testimonialText="The quality of engineers we've hired since implementing Hire10xdevs has increased dramatically. The platform lets us see exactly how candidates think and solve problems."
            authorProfileImage="https://via.placeholder.com/40/0000FF/FFFFFF?text=MC"
            authorProfileImageAlt="Michael Chen's profile picture"
            authorName="Michael Chen"
          />
          <TestimonialCard
            href="#"
            cardVariant="mb-8"
            platformName="Global Devs Ltd."
            platformNameVariant="text-gray-600"
            starIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-22.svg"
            quoteIconUrl="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-23.svg"
            testimonialText="We've reduced our time-to-hire by 40% while simultaneously improving the quality of our technical assessments. The AI assistant feature is genuinely innovative."
            authorProfileImage="https://via.placeholder.com/40/008000/FFFFFF?text=RW"
            authorProfileImageAlt="Rachel Williams's profile picture"
            authorName="Rachel Williams"
          />
        </div>
      </div>
    </section>
  );
};