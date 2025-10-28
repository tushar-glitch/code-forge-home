import { BeforeCard } from "@/components/ui/BeforeCard";
import { AfterCard } from "@/components/ui/AfterCard";

export const BeforeAfterCards = () => {
  return (
    <div className="items-stretch box-border caret-transparent gap-x-8 grid grid-cols-none max-w-screen-lg gap-y-8 mx-auto md:grid-cols-[repeat(2,minmax(0px,1fr))]">
      <BeforeCard />
      <AfterCard />
    </div>
  );
};
