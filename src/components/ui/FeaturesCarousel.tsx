import { FeatureSlide } from "@/components/ui/FeatureSlide";

export const FeaturesCarousel = () => {
  return (
    <div className="relative items-center box-border caret-transparent gap-x-2 flex justify-center gap-y-2 md:gap-x-4 md:gap-y-4">
      <button
        aria-label="Previous screenshot"
        className="self-center backdrop-blur-sm bg-white/80 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] caret-transparent hidden shrink-0 min-h-0 min-w-0 text-center p-2 rounded-full md:flex md:min-h-[auto] md:min-w-[auto] md:p-3 hover:bg-white"
      >
        <img
          src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-31.svg"
          alt="Icon"
          className="text-gray-700 box-border caret-transparent h-5 w-5 md:h-6 md:w-6"
        />
      </button>
      <div className="relative bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.25)_0px_25px_50px_-12px] box-border caret-transparent w-full border border-gray-200 overflow-hidden rounded-[10.4px] border-solid">
        <div className="absolute bg-[linear-gradient(to_right,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 left-0 inset-y-0 md:hidden"></div>
        <div className="absolute bg-[linear-gradient(to_left,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 right-0 inset-y-0 md:hidden"></div>
        <div
          role="tabpanel"
          className="box-border caret-transparent gap-x-0 grid grid-cols-none min-h-[500px] gap-y-0 md:grid-cols-[repeat(3,minmax(0px,1fr))] md:min-h-[600px]"
        >
          <FeatureSlide />
          <div className="bg-[linear-gradient(to_right,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 left-0 inset-y-0 md:hidden"></div>
          <div className="bg-[linear-gradient(to_left,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 right-0 inset-y-0 md:hidden"></div>
          <div className="relative items-center box-border caret-transparent flex col-end-auto col-start-auto justify-center p-2 md:col-end-[span_2] md:col-start-[span_2] md:p-4">
            <div className="relative items-center box-border caret-transparent flex justify-center max-h-[500px] max-w-full min-w-fit">
              <div className="relative box-border caret-transparent h-full w-fit">
                <video
                  src="/images/interface/dashboard.mp4"
                  autoplay=""
                  loop=""
                  playsinline=""
                  className="shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] box-border caret-transparent h-full max-w-full w-full rounded-[10.4px]"
                ></video>
              </div>
            </div>
          </div>
          <div className="bg-[linear-gradient(to_right,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 left-0 inset-y-0 md:hidden"></div>
          <div className="bg-[linear-gradient(to_left,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 right-0 inset-y-0 md:hidden"></div>
          <div className="relative items-center box-border caret-transparent flex col-end-auto col-start-auto justify-center p-2 md:col-end-[span_2] md:col-start-[span_2] md:p-4">
            <div className="relative items-center box-border caret-transparent flex justify-center max-h-[500px] max-w-full min-w-fit">
              <div className="relative box-border caret-transparent h-full w-fit">
                <video
                  src="/images/interface/surveys.mp4"
                  autoplay=""
                  loop=""
                  playsinline=""
                  className="shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] box-border caret-transparent h-full max-w-full w-full rounded-[10.4px]"
                ></video>
              </div>
            </div>
          </div>
          <div className="bg-[linear-gradient(to_right,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 left-0 inset-y-0 md:hidden"></div>
          <div className="bg-[linear-gradient(to_left,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 right-0 inset-y-0 md:hidden"></div>
          <div className="relative items-center box-border caret-transparent flex col-end-auto col-start-auto justify-center p-2 md:col-end-[span_2] md:col-start-[span_2] md:p-4">
            <div className="relative items-center box-border caret-transparent flex justify-center max-h-[500px] max-w-full min-w-fit">
              <div className="relative box-border caret-transparent h-full w-fit">
                <video
                  src="/images/interface/feature_requests.mp4"
                  autoplay=""
                  loop=""
                  playsinline=""
                  className="shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] box-border caret-transparent h-full max-w-full w-full rounded-[10.4px]"
                ></video>
              </div>
            </div>
          </div>
          <div className="bg-[linear-gradient(to_right,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 left-0 inset-y-0 md:hidden"></div>
          <div className="bg-[linear-gradient(to_left,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 right-0 inset-y-0 md:hidden"></div>
          <div className="relative items-center box-border caret-transparent flex col-end-auto col-start-auto justify-center p-2 md:col-end-[span_2] md:col-start-[span_2] md:p-4">
            <div className="relative items-center box-border caret-transparent flex justify-center max-h-[500px] max-w-full min-w-fit">
              <div className="relative box-border caret-transparent h-full w-fit">
                <video
                  src="/images/interface/roadmap.mp4"
                  autoplay=""
                  loop=""
                  playsinline=""
                  className="shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] box-border caret-transparent h-full max-w-full w-full rounded-[10.4px]"
                ></video>
              </div>
            </div>
          </div>
          <div className="bg-[linear-gradient(to_right,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 left-0 inset-y-0 md:hidden"></div>
          <div className="bg-[linear-gradient(to_left,rgba(0,0,0,0.05),rgba(0,0,0,0))] box-border caret-transparent block pointer-events-none w-1 z-10 right-0 inset-y-0 md:hidden"></div>
          <div className="relative items-center box-border caret-transparent flex col-end-auto col-start-auto justify-center p-2 md:col-end-[span_2] md:col-start-[span_2] md:p-4">
            <div className="relative items-center box-border caret-transparent flex justify-center max-h-[500px] max-w-full min-w-fit">
              <div className="relative box-border caret-transparent h-full w-fit">
                <video
                  src="/images/interface/reviews.mp4"
                  autoplay=""
                  loop=""
                  playsinline=""
                  className="shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] box-border caret-transparent h-full max-w-full w-full rounded-[10.4px]"
                ></video>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        aria-label="Next screenshot"
        className="self-center backdrop-blur-sm bg-white/80 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] caret-transparent hidden shrink-0 min-h-0 min-w-0 text-center p-2 rounded-full md:flex md:min-h-[auto] md:min-w-[auto] md:p-3 hover:bg-white"
      >
        <img
          src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-32.svg"
          alt="Icon"
          className="text-gray-700 box-border caret-transparent h-5 w-5 md:h-6 md:w-6"
        />
      </button>
    </div>
  );
};
