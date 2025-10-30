export type FAQItemProps = {
  question: string;
  answer: string;
  iconUrl?: string;
};

export const FAQItem = (props: FAQItemProps) => {
  return (
    <div className="bg-white box-border caret-transparent border border-gray-200 px-8 rounded-2xl border-solid">
      <h3 className="box-border caret-transparent flex">
        <button
          type="button"
          className="text-lg font-semibold items-center bg-transparent caret-transparent gap-x-3 flex basis-[0%] grow justify-between leading-7 gap-y-3 text-left px-0 py-4"
        >
          {props.question}
          <div className="items-center box-border caret-transparent flex shrink-0 h-10 justify-center w-10 rounded-lg"></div>
          <img
            src={
              props.iconUrl ||
              "https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/icon-39.svg"
            }
            alt="Icon"
            className="box-border caret-transparent hidden shrink-0 h-4 w-4"
          />
        </button>
      </h3>
      <div
        role="region"
        className="text-sm box-border caret-transparent leading-5 overflow-hidden"
      >
        <p className="pb-4">{props.answer}</p>
      </div>
    </div>
  );
};
