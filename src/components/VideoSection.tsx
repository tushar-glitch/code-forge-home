import { VideoPlayer } from "@/components/ui/VideoPlayer";

export const VideoSection = () => {
  return (
    <section className="relative bg-[linear-gradient(rgb(249,250,251),rgb(255,255,255))] box-border caret-transparent py-20">
      <div className="box-border caret-transparent w-full mx-auto px-8">
        <div className="box-border caret-transparent text-center mb-12">
          <h2 className="text-3xl font-semibold box-border caret-transparent tracking-[-0.75px] leading-9 mb-4 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
            How it <span className="text-violet-500 text-3xl box-border caret-transparent tracking-[-0.75px] leading-9 md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">works</span>
          </h2>
          <p className="text-gray-600 text-lg box-border caret-transparent leading-7 mb-2">
            Our platform provides an end-to-end solution for assessing developer skills
            through practical, real-world coding challenges
          </p>
        </div>
        <div className="relative box-border caret-transparent max-w-4xl mt-8 mx-auto">
          <div className="absolute bg-[linear-gradient(to_right,rgb(99,102,241),rgb(168,85,247))] box-border caret-transparent blur opacity-25 rounded-2xl -inset-1"></div>
          <div className="relative bg-violet-500 box-border caret-transparent p-0 rounded-2xl md:p-10">
            <VideoPlayer />
          </div>
        </div>
      </div>
    </section>
  );
};
