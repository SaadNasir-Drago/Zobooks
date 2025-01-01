import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white pt-8 pb-4 px-4">
      {/* Primary Navigation */}
      <div className="max-w-7xl mx-auto">
        <nav className="border-b border-gray-200 pb-6">
          <ul className="flex flex-wrap justify-center gap-x-6 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-gray-900">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Zestimates
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Research
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Careers - U.S.
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Privacy Notice
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Careers - Mexico
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Privacy Notice
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Help
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Advertise
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Fair Housing Guide
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Advocacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Terms of use
              </a>
            </li>
          </ul>
        </nav>

        {/* Secondary Navigation */}
        <nav className="py-4 border-b border-gray-200">
          <ul className="flex flex-wrap justify-center gap-x-6 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-gray-900">
                Privacy Portal
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Cookie Preference
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Learn
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                AI
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Mobile Apps
              </a>
            </li>
          </ul>
        </nav>


        {/* Do Not Sell Info */}
        <div className="py-2 text-center">
          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
            Do Not Sell or Share My Personal Information
          </a>
        </div>

        {/* Accessibility Statement */}
        <div className="text-xs text-gray-600 text-center max-w-4xl mx-auto py-2">
          <p className="mb-2">
            Zillow Group is committed to ensuring digital accessibility for
            individuals with disabilities. We are continuously working to
            improve the accessibility of our web experience for everyone, and we
            welcome feedback and accommodation requests. If you wish to report
            an issue or seek an accommodation,
            <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">
              please let us know
            </a>
            .
          </p>
        </div>

        {/* Legal Information */}
        <div className="text-xs text-gray-600 text-center py-2">
          <div className="mb-4">
            <p>
              For listings in Canada, the trademarks REALTOR®, REALTORS®, and
              the REALTOR® logo are controlled by The Canadian Real Estate
              Association (CREA)
            </p>
            <p>
              and identify real estate professionals who are members of CREA.
              The trademarks MLS®, Multiple Listing Service® and the
              associated logos are owned
            </p>
            <p>
              by CREA and identify the quality of services provided by real
              estate professionals who are members of CREA. Used under license.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
