export type PricingCardProps = {
  planName: string;
  badge?: {
    text: string;
    iconUrl: string;
  };
  price: string;
  originalPrice?: string;
  priceSuffix: string;
  description: string;
  features: string[];
  additionalInfo?: string;
  buttonText: string;
  buttonHref: string;
  buttonVariant: string;
};

export const PricingCard = (props: PricingCardProps) => {
  return (
    <div className="relative bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px] box-border caret-transparent gap-x-7 flex flex-col justify-between gap-y-7 border border-gray-200 px-7 py-8 rounded-2xl border-solid">
      <div className="box-border caret-transparent gap-x-3 flex flex-col gap-y-3">
        <div className="items-center box-border caret-transparent flex justify-between">
          <h4 className="text-2xl font-semibold box-border caret-transparent leading-8">
            {props.planName}
          </h4>
          {props.badge && (
            <span className="text-white text-sm font-semibold items-center bg-[linear-gradient(to_right,rgb(249,115,22),rgb(239,68,68))] box-border caret-transparent gap-x-1 flex leading-5 gap-y-1 text-center px-3 py-1 rounded-full">
              <img
                src={props.badge.iconUrl}
                alt="Icon"
                className="box-border caret-transparent h-4 w-4"
              />
              {props.badge.text}
            </span>
          )}
        </div>
        <div className="box-border caret-transparent">
          <span className="text-violet-500 text-5xl font-semibold box-border caret-transparent leading-[48px]">
            {props.price}
          </span>
          {props.originalPrice && (
            <span className="text-gray-500 text-xl font-semibold box-border caret-transparent leading-7 line-through ml-2">
              {props.originalPrice}
            </span>
          )}
          <span className="text-gray-500 text-xl box-border caret-transparent leading-7 ml-1">
            {props.priceSuffix}
          </span>
        </div>
        <p className="text-gray-500 text-base box-border caret-transparent leading-6">
          {props.description}
        </p>
        <ul className="box-border caret-transparent list-none mt-4 pl-0">
          {props.features.map((feature, index) => (
            <li
              key={index}
              className={
                index === 0
                  ? "items-center box-border caret-transparent gap-x-2 flex gap-y-2"
                  : "items-center box-border caret-transparent gap-x-2 flex gap-y-2 mt-3"
              }
            >
              <img
                src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-33.svg"
                alt="Icon"
                className="text-green-500 box-border caret-transparent shrink-0 h-5 w-5"
              />
              <span className="text-gray-700 text-sm box-border caret-transparent block leading-5">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {props.additionalInfo && (
        <p className="text-gray-500 text-sm box-border caret-transparent leading-5 mt-4">
          {props.additionalInfo}
        </p>
      )}
      <a href={props.buttonHref} className="box-border caret-transparent block">
        <button
          className={`text-gray-50 text-lg font-semibold items-center bg-violet-500 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_4px_6px_-1px,rgba(0,0,0,0.1)_0px_2px_4px_-2px] box-border caret-transparent flex h-11 justify-center leading-7 text-center text-nowrap w-full px-8 py-4 rounded-[8.4px] hover:bg-violet-500/90 ${props.buttonVariant}`}
        >
          {props.buttonText}
        </button>
      </a>
    </div>
  );
};
