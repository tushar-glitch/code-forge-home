export const FooterBottom = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="box-border caret-transparent border-gray-200 mt-12 pt-8 border-t border-solid">
      <div className="items-center box-border caret-transparent flex flex-col justify-between md:flex-row">
        <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
          © {currentYear} hire10xdevs. All rights reserved.
        </p>
        <div className="items-center box-border caret-transparent flex mt-4 md:mt-0">
          <ul className="box-border caret-transparent flex list-none pl-0">
            <li className="box-border caret-transparent">
              <a
                href="/privacy"
                className="text-gray-500 text-sm box-border caret-transparent leading-5 hover:text-gray-950"
              >
                Privacy Policy
              </a>
            </li>
            <li className="box-border caret-transparent ml-6">
              <a
                href="/tos"
                className="text-gray-500 text-sm box-border caret-transparent leading-5 hover:text-gray-950"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};