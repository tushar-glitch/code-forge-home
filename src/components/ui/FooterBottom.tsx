export const FooterBottom = () => {
  return (
    <div className="box-border caret-transparent border-gray-200 mt-12 pt-8 border-t border-solid">
      <div className="items-center box-border caret-transparent flex flex-col justify-between md:flex-row">
        <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
          © 2025Feedbask. All rights reserved.
        </p>
        <div className="items-center box-border caret-transparent flex mt-4 md:mt-0">
          <ul className="box-border caret-transparent flex list-none pl-0">
            <li className="box-border caret-transparent">
              <a
                href="/privacy"
                className="text-gray-500 text-sm box-border caret-transparent leading-5 hover:text-gray-950"
              >
                Privacy
              </a>
            </li>
            <li className="box-border caret-transparent ml-6">
              <a
                href="/tos"
                className="text-gray-500 text-sm box-border caret-transparent leading-5 hover:text-gray-950"
              >
                Terms
              </a>
            </li>
          </ul>
          <a
            href="https://www.uneed.best/tool/feedbask"
            className="box-border caret-transparent block ml-6"
          >
            <img
              src="https://c.animaapp.com/mh3bm6d0mEyMQZ/assets/POTD1.png"
              alt="Uneed POTD1 Badge"
              className="box-border caret-transparent max-w-full w-[200px]"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
