export const CTASection = () => {
  return (
    <section className="box-border caret-transparent py-20">
      <div className="box-border caret-transparent w-full mx-auto px-8">
        <div className="items-center bg-[linear-gradient(to_right,rgba(134,107,255,0.05),rgba(168,85,247,0.05))] box-border caret-transparent gap-x-6 flex flex-col gap-y-14 border border-violet-500/20 px-10 py-20 rounded-2xl border-solid md:flex-row">
          <div className="items-start box-border caret-transparent gap-x-6 flex basis-3/5 flex-col gap-y-6">
            <h2 className="text-3xl font-semibold box-border caret-transparent tracking-[-0.75px] leading-9 max-w-2xl text-left md:text-5xl md:tracking-[-1.2px] md:leading-[48px]">
              Ready to collect 10x more feedback?
            </h2>
            <p className="text-gray-500 text-lg box-border caret-transparent leading-7 max-w-lg text-left md:text-xl">
              <strong className="text-lg font-bold box-border caret-transparent md:text-xl">
                Join 250+ happy users
              </strong>
              already using our widget. 3 minutes setup, immediate results.
            </p>
            <div className="text-sm box-border caret-transparent leading-5">
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                <span className="text-green-500 font-bold box-border caret-transparent block">
                  ✓
                </span>
                <span className="box-border caret-transparent block">
                  <strong className="font-bold box-border caret-transparent">
                    Free forever
                  </strong>
                  - No credit card required
                </span>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2 mt-2">
                <span className="text-green-500 font-bold box-border caret-transparent block">
                  ✓
                </span>
                <span className="box-border caret-transparent block">
                  3 minutes setup - 1 line of code to copy
                </span>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2 mt-2">
                <span className="text-green-500 font-bold box-border caret-transparent block">
                  ✓
                </span>
                <span className="box-border caret-transparent block">
                  Toggle modules - Enable only what you need
                </span>
              </div>
            </div>
            <a
              href="/auth"
              className="text-gray-50 text-lg font-semibold items-center bg-violet-500 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_4px_6px_-1px,rgba(0,0,0,0.1)_0px_2px_4px_-2px] box-border caret-transparent inline-flex justify-center px-8 py-4 rounded-[8.4px] hover:bg-violet-500/90"
            >
              Start Now
            </a>
          </div>
          <div className="relative box-border caret-transparent basis-2/5">
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
                        Share Feedback
                      </h5>
                      <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                        Help us improve by sharing your thoughts
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50/50 box-border caret-transparent border border-gray-200 mt-3 p-3 rounded-[10.4px] border-solid">
                  <div className="items-center box-border caret-transparent gap-x-3 flex gap-y-3">
                    <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
                      <img
                        src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-40.svg"
                        alt="Icon"
                        className="text-gray-500 box-border caret-transparent h-5 w-5"
                      />
                    </div>
                    <div className="box-border caret-transparent basis-[0%] grow">
                      <h5 className="text-gray-800 font-medium box-border caret-transparent">
                        Leave a Review
                      </h5>
                      <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                        Share your experience with our product
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50/50 box-border caret-transparent border border-red-200 mt-3 p-3 rounded-[10.4px] border-solid">
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
                        Report a Bug
                      </h5>
                      <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                        Let us know if something isn't working
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50/50 box-border caret-transparent border border-green-200 mt-3 p-3 rounded-[10.4px] border-solid">
                  <div className="items-center box-border caret-transparent gap-x-3 flex gap-y-3">
                    <div className="items-center bg-green-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
                      <img
                        src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-18.svg"
                        alt="Icon"
                        className="text-green-500 box-border caret-transparent h-5 w-5"
                      />
                    </div>
                    <div className="box-border caret-transparent basis-[0%] grow">
                      <h5 className="text-gray-800 font-medium box-border caret-transparent">
                        Suggest a Feature
                      </h5>
                      <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                        Share your ideas for new features
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-xs box-border caret-transparent leading-4 mt-4 text-right">
                Powered by{" "}
                <span className="font-semibold box-border caret-transparent">
                  Feedbask
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
