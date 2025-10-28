export const HeroFeatures = () => {
  return (
    <div className="text-gray-500 text-sm items-center box-border caret-transparent gap-x-6 flex flex-wrap justify-center leading-5 gap-y-6 mb-6">
      <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
        <img
          src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-3.svg"
          alt="Icon"
          className="text-green-500 box-border caret-transparent h-4 w-4"
        />
        <span className="box-border caret-transparent block">
          Realistic assessments
        </span>
      </div>
      <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
        <img
          src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-4.svg"
          alt="Icon"
          className="text-green-500 box-border caret-transparent h-4 w-4"
        />
        <span className="box-border caret-transparent block">
          In-browser IDE
        </span>
      </div>
      <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
        <img
          src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-5.svg"
          alt="Icon"
          className="text-green-500 box-border caret-transparent h-4 w-4"
        />
        <span className="box-border caret-transparent block">
          AI-powered assistance
        </span>
      </div>
    </div>
  );
};
