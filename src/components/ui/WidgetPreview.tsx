export const WidgetPreview = () => {
  return (
    <div className="relative box-border caret-transparent">
      <h4 className="text-gray-800 text-lg font-semibold box-border caret-transparent leading-7 mb-4">
        Live Widget Preview
      </h4>
      <div className="relative box-border caret-transparent max-w-sm mx-auto">
        <div className="absolute bg-[linear-gradient(to_right_bottom,rgba(37,99,235,0.2),rgba(147,51,234,0.2))] box-border caret-transparent blur-xl translate-y-2 rounded-2xl inset-0"></div>
        <div className="relative bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.25)_0px_25px_50px_-12px] box-border caret-transparent min-h-[350px] border border-gray-200 overflow-hidden rounded-2xl border-solid">
          <div className="text-white bg-[linear-gradient(to_right,rgb(37,99,235),rgb(147,51,234))] box-border caret-transparent p-4">
            <div className="items-center box-border caret-transparent flex justify-between">
              <div className="items-center box-border caret-transparent gap-x-3 flex gap-y-3">
                <div className="box-border caret-transparent">
                  <h5 className="box-border caret-transparent mb-0.5">Hi 👋</h5>
                  <p className="text-xl font-medium box-border caret-transparent leading-7">
                    How can we help you today?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="box-border caret-transparent min-h-[270px] p-4">
            <div className="bg-red-50/50 box-border caret-transparent border border-red-200 p-3 rounded-[10.4px] border-solid">
              <div className="items-center box-border caret-transparent gap-x-3 flex gap-y-3">
                <div className="items-center bg-red-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
                  <img
                    src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-16.svg"
                    alt="Icon"
                    className="text-red-500 box-border caret-transparent h-5 w-5"
                  />
                </div>
                <div className="box-border caret-transparent basis-[0%] grow">
                  <h5 className="text-gray-800 font-medium box-border caret-transparent">
                    Report Bug
                  </h5>
                  <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                    Found an issue?
                  </p>
                </div>
                <img
                  src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-17.svg"
                  alt="Icon"
                  className="text-gray-400 box-border caret-transparent shrink-0 h-5 w-5"
                />
              </div>
            </div>
            <div className="bg-violet-50/50 box-border caret-transparent border border-violet-200 mt-3 p-3 rounded-[10.4px] border-solid">
              <div className="items-center box-border caret-transparent gap-x-3 flex gap-y-3">
                <div className="items-center bg-violet-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
                  <img
                    src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-18.svg"
                    alt="Icon"
                    className="text-violet-500 box-border caret-transparent h-5 w-5"
                  />
                </div>
                <div className="box-border caret-transparent basis-[0%] grow">
                  <h5 className="text-gray-800 font-medium box-border caret-transparent">
                    Suggest Feature
                  </h5>
                  <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                    Share your ideas
                  </p>
                </div>
                <img
                  src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-17.svg"
                  alt="Icon"
                  className="text-gray-400 box-border caret-transparent shrink-0 h-5 w-5"
                />
              </div>
            </div>
            <div className="bg-orange-50/50 box-border caret-transparent border border-orange-200 mt-3 p-3 rounded-[10.4px] border-solid">
              <div className="items-center box-border caret-transparent gap-x-3 flex gap-y-3">
                <div className="items-center bg-orange-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
                  <img
                    src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-19.svg"
                    alt="Icon"
                    className="text-orange-500 box-border caret-transparent h-5 w-5"
                  />
                </div>
                <div className="box-border caret-transparent basis-[0%] grow">
                  <h5 className="text-gray-800 font-medium box-border caret-transparent">
                    Live Chat
                  </h5>
                  <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                    Chat with us
                  </p>
                </div>
                <img
                  src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-17.svg"
                  alt="Icon"
                  className="text-gray-400 box-border caret-transparent shrink-0 h-5 w-5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
