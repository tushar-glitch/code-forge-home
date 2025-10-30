import { ModuleControls } from "@/components/ui/ModuleControls";
import { WidgetPreview } from "@/components/ui/WidgetPreview";

export const ModulesSection = () => {
  return (
    <section className="relative bg-[linear-gradient(rgb(255,255,255),rgb(249,250,251))] box-border caret-transparent py-20">
      <div className="box-border caret-transparent gap-x-12 flex flex-col gap-y-12 w-full mx-auto px-8">
        <div className="bg-[linear-gradient(rgb(239,246,255),rgb(250,245,255))] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent p-8 rounded-2xl">
          <div className="box-border caret-transparent text-center mb-12">
            <h2 className="text-3xl font-bold box-border caret-transparent tracking-[-0.75px] leading-9 mb-4 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
              Powerful <span className="text-violet-500 text-3xl box-border caret-transparent tracking-[-0.75px] leading-9 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
                features
              </span>
            </h2>
            <p className="text-gray-700 text-lg font-semibold box-border caret-transparent leading-7 mb-2">
              Our platform provides all the tools needed to create realistic coding
              assessments and evaluate candidates effectively
            </p>
          </div>
          <div className="items-start box-border caret-transparent gap-x-8 grid grid-cols-[repeat(1,minmax(0px,1fr))] gap-y-8 mx-auto md:grid-cols-[repeat(2,minmax(0px,1fr))] md:max-w-screen-lg">
            <ModuleControls />
            <WidgetPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
