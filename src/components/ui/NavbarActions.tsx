export const NavbarActions = () => {
  return (
    <div className="items-center box-border caret-transparent gap-x-10 flex basis-[0%] grow justify-end gap-y-10">
      <div className="items-center box-border caret-transparent gap-x-2 hidden min-h-0 min-w-0 gap-y-2 md:flex md:min-h-[auto] md:min-w-[auto]">
        <a
          href="/auth"
          className="text-gray-50 text-sm font-semibold items-center bg-violet-500 box-border caret-transparent gap-x-2 inline-flex h-10 justify-center leading-5 min-h-0 min-w-0 gap-y-2 text-nowrap px-4 py-2 rounded-[8.4px] md:flex md:min-h-[auto] md:min-w-[auto] hover:bg-violet-500/90"
        >
          Log In
        </a>
      </div>
    </div>
  );
};
