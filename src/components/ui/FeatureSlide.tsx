export const FeatureSlide = () => {
  return (
    <div className="relative items-center box-border caret-transparent flex col-end-auto col-start-auto justify-center p-2 md:col-end-[span_2] md:col-start-[span_2] md:p-4">
      <div className="relative items-center box-border caret-transparent flex justify-center max-h-[500px] max-w-full min-w-fit">
        <div className="relative box-border caret-transparent h-full w-fit">
          <video
            src="/images/interface/bug_reports.mp4"
            autoplay=""
            loop=""
            playsinline=""
            className="shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] box-border caret-transparent h-full max-w-full w-full rounded-[10.4px]"
          ></video>
        </div>
      </div>
    </div>
  );
};
