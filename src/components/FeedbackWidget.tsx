export const FeedbackWidget = () => {
  return (
    <div className="relative box-border caret-transparent z-[2147483640]">
      <div className="box-border caret-transparent">
        <button className="fixed text-white items-center bg-purple-600 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] caret-transparent gap-x-2 flex gap-y-2 text-center z-50 px-4 py-2 rounded-full right-5 bottom-5">
          <img
            src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-41.svg"
            alt="Icon"
            className="box-border caret-transparent h-4 w-4"
          />
          <span className="box-border caret-transparent block">Feedback</span>
        </button>
      </div>
    </div>
  );
};
