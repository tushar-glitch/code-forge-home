export const VideoPlayer = () => {
  return (
    <div className="relative box-border caret-transparent">
      <video
        src="https://pagppnqdezmhzrapsovg.supabase.co/storage/v1/object/public/ai-agents/assests/Final.mp4"
        loop=""
        playsinline=""
        className="shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] box-border caret-transparent max-w-full w-full rounded-2xl"
      ></video>
      <div className="absolute box-border caret-transparent bottom-4 inset-x-4">
        <div className="bg-white/30 box-border caret-transparent h-1 rounded-full">
          <div className="bg-white box-border caret-transparent h-full w-[34.0765%] rounded-full md:w-[56.4795%]"></div>
        </div>
      </div>
      <div className="absolute box-border caret-transparent gap-x-2 flex gap-y-2 right-4 bottom-4">
        <button
          aria-label="Pause video"
          className="backdrop-blur-sm bg-black/50 caret-transparent block text-center p-3 rounded-full hover:bg-black/70"
        >
          <img
            src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-9.svg"
            alt="Icon"
            className="text-white box-border caret-transparent h-5 w-5"
          />
        </button>
        <button
          aria-label="Unmute video"
          className="backdrop-blur-sm bg-black/50 caret-transparent block text-center p-3 rounded-full hover:bg-black/70"
        >
          <img
            src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-10.svg"
            alt="Icon"
            className="text-white box-border caret-transparent h-5 w-5"
          />
        </button>
      </div>
    </div>
  );
};
