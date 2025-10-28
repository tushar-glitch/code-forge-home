import { Navbar } from "@/components/ui/Navbar";

export const Header = () => {
  return (
    <header className="relative box-border caret-transparent z-50">
      <div className="box-border caret-transparent w-full mt-0 mx-auto px-8 md:mt-4">
        <div className="box-border caret-transparent mx-2 px-0 md:mx-10 md:px-6">
          <Navbar />
        </div>
      </div>
    </header>
  );
};
