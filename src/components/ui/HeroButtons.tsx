export const HeroButtons = () => {
  return (
    <div className="items-center box-border caret-transparent gap-x-4 flex flex-col gap-y-4 mb-16 md:flex-row">
      <a href="/auth" className="box-border caret-transparent block">
        <button className="text-gray-50 text-lg font-semibold items-center bg-violet-500 caret-transparent gap-x-2 inline-flex h-11 justify-center leading-7 gap-y-2 text-center text-nowrap px-8 py-4 rounded-[8.4px] hover:bg-violet-500/90">
          Start for free
        </button>
      </a>
    </div>
  );
};
