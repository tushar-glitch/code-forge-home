import { NavbarLogo } from "@/components/ui/NavbarLogo";
import { DesktopNav } from "@/components/ui/DesktopNav";
import { NavbarActions } from "@/components/ui/NavbarActions";
import { MobileMenuButton } from "@/components/ui/MobileMenuButton";

export const Navbar = () => {
  return (
    <div className="items-center box-border caret-transparent flex justify-between w-full py-4">
      <NavbarLogo />
      <div className="items-center box-border caret-transparent gap-x-6 flex basis-[0%] grow justify-center gap-y-6">
        <DesktopNav />
      </div>
      <NavbarActions />
      <MobileMenuButton />
    </div>
  );
};
