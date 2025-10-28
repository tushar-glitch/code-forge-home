import { HeroHeading } from "@/components/ui/HeroHeading";
import { HeroDescription } from "@/components/ui/HeroDescription";
import { HeroFeatures } from "@/components/ui/HeroFeatures";
import { HeroButtons } from "@/components/ui/HeroButtons";

export const HeroContent = () => {
  return (
    <div className="relative items-center box-border caret-transparent gap-x-6 flex flex-col gap-y-6 mx-2 pt-20 md:mx-10">
      <div className="text-gray-900 text-sm font-medium items-center bg-gray-100 box-border caret-transparent flex leading-5 border mb-2 px-4 py-2 rounded-full border-solid border-transparent">
        <img
          src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-2.svg"
          alt="Icon"
          className="text-yellow-500 box-border caret-transparent h-4 w-4 mr-2"
        />
        Technical hiring reimagined
      </div>
      <HeroHeading />
      <div className="bg-indigo-600 box-border caret-transparent h-1 w-20 mx-auto"></div>
      <HeroDescription />
      <HeroFeatures />
      <HeroButtons />
    </div>
  );
};
