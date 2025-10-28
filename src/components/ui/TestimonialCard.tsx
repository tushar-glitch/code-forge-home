export type TestimonialCardProps = {
  href: string;
  cardVariant: string;
  platformLogo?: string;
  platformLogoAlt?: string;
  platformLogoVariant?: string;
  platformName: string;
  platformNameVariant: string;
  starIconUrl: string;
  quoteIconUrl: string;
  testimonialText: string;
  authorProfileImage?: string;
  authorProfileImageAlt: string;
  authorName: string;
  authorInitial?: string;
};

export const TestimonialCard = (props: TestimonialCardProps) => {
  return (
    <a
      href={props.href}
      className={`box-border break-inside-avoid caret-transparent block ${props.cardVariant}`}
    >
      <div className="relative bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px] box-border break-inside-avoid caret-transparent inline-block w-full border border-gray-200 mt-7 rounded-2xl border-solid hover:shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_4px_6px_-1px,rgba(0,0,0,0.1)_0px_2px_4px_-2px]">
        <div className="absolute box-border caret-transparent z-10 right-4 top-4">
          <div
            className={`items-center shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent gap-x-1 flex gap-y-1 px-2 py-1 rounded-full ${props.platformLogoVariant}`}
          >
            {props.platformLogo && (
              <img
                src={props.platformLogo}
                alt={props.platformLogoAlt}
                className="box-border caret-transparent h-4 w-4 hidden max-w-full"
              />
            )}
            <span
              className={`text-xs font-medium box-border caret-transparent block leading-4 ${props.platformNameVariant}`}
            >
              {props.platformName}
            </span>
          </div>
        </div>
        <div className="box-border caret-transparent p-6">
          <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1 mb-4">
            <img
              src={props.starIconUrl}
              alt="Star icon"
              className="box-border caret-transparent h-4 w-4"
            />
            <img
              src={props.starIconUrl}
              alt="Star icon"
              className="box-border caret-transparent h-4 w-4"
            />
            <img
              src={props.starIconUrl}
              alt="Star icon"
              className="box-border caret-transparent h-4 w-4"
            />
            <img
              src={props.starIconUrl}
              alt="Star icon"
              className="box-border caret-transparent h-4 w-4"
            />
            <img
              src={props.starIconUrl}
              alt="Star icon"
              className="box-border caret-transparent h-4 w-4"
            />
          </div>
          <img
            src={props.quoteIconUrl}
            alt="Quote icon"
            className="box-border caret-transparent h-6 w-6 mb-4"
          />
          <p className="text-gray-700 text-lg box-border caret-transparent leading-7 mb-4">
            {props.testimonialText}
          </p>
          <div className="items-center box-border caret-transparent gap-x-3 flex gap-y-3">
            {props.authorProfileImage ? (
              <img
                src={props.authorProfileImage}
                alt={props.authorProfileImageAlt}
                className="box-border caret-transparent h-10 w-10 rounded-full"
              />
            ) : (
              <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
                <span className="text-gray-700 text-sm font-medium box-border caret-transparent leading-5">
                  {props.authorInitial}
                </span>
              </div>
            )}
            <div className="box-border caret-transparent">
              <p className="text-gray-700 font-semibold box-border caret-transparent">
                {props.authorName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};
