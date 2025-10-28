export type FooterColumnProps = {
  title: string;
  links: Array<{
    href: string;
    text: string;
  }>;
  secondaryTitle?: string;
  secondaryLinks?: Array<{
    href: string;
    text: string;
  }>;
  tertiaryLinks?: Array<{
    href: string;
    text: string;
  }>;
};

export const FooterColumn = (props: FooterColumnProps) => {
  return (
    <div className="box-border caret-transparent">
      <h3 className="text-gray-900 text-lg font-semibold box-border caret-transparent tracking-[0.45px] leading-7 uppercase">
        {props.title}
      </h3>
      <ul className="box-border caret-transparent list-none mt-4 pl-0">
        {props.links.map((link, index) => (
          <li
            key={index}
            className={
              index === 0
                ? "box-border caret-transparent"
                : "box-border caret-transparent mt-2"
            }
          >
            <a
              href={link.href}
              className="text-gray-500 text-sm box-border caret-transparent leading-5 hover:text-gray-950"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
      {props.secondaryTitle && (
        <>
          <h3 className="text-gray-900 text-lg font-semibold box-border caret-transparent tracking-[0.45px] leading-7 uppercase mt-8">
            {props.secondaryTitle}
          </h3>
          {props.secondaryLinks && (
            <ul className="box-border caret-transparent list-none mt-4 pl-0">
              {props.secondaryLinks.map((link, index) => (
                <li
                  key={index}
                  className={
                    index === 0
                      ? "box-border caret-transparent"
                      : "box-border caret-transparent mt-2"
                  }
                >
                  <a
                    href={link.href}
                    className="text-gray-500 text-sm box-border caret-transparent leading-5 hover:text-gray-950"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {props.tertiaryLinks && (
        <ul className="box-border caret-transparent list-none mt-4 pl-0">
          {props.tertiaryLinks.map((link, index) => (
            <li
              key={index}
              className={
                index === 0
                  ? "box-border caret-transparent"
                  : "box-border caret-transparent mt-2"
              }
            >
              <a
                href={link.href}
                className="text-gray-500 text-sm box-border caret-transparent leading-5 hover:text-gray-950"
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
