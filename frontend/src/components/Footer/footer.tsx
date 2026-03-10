import React, { useState } from 'react';

type MyObject = { [key: string]: boolean };
const Footer = () => {
  const [accordianName, setAccordianName] = useState<MyObject>({
    tab1: false,
    tab2: false,
  });
  return (
    <footer className="footer">
      <div className="get-in-touch blue-bg">
        <div className="container">
          <h5 className="mg-b24">Get in touch with us</h5>
          <div className="contact-wrapper">
            <div className="contact-details">
              <div className="contact-block">
                <div className="block-icon">
                  <i className="icon-map-pin"></i>
                </div>
                 <p className="size-14">
                  <span className="secondary-bold mg-b4">
                    Pramerica Life Insurance Limited
                  </span>
                  <br />
                  7th & 8th Floor, Tower 2, Capital Business Park,
                  Sector 48, Gurugram – 122018
                </p>
              </div>
              <div className="contact-block">
                <div className="block-icon">
                  <i className="icon-phone"></i>
                </div>
                <p className="size-14">
                  <span className="secondary-bold mg-b4">
                    Customer Service Numbers
                  </span>
                  <br />
                  1860 500 7070
                  <br />
                  (Local charges apply)
                  <br />
                  011-4818 7070
                  <br />
                 9:00 AM to 7:00 PM
                  <br />
                  (Monday - Saturday)
                </p>
              </div>
              <div className="contact-block">
                <div className="block-icon">
                  <i className="icon-msg"></i>
                </div>
                <p className="size-14">
                  <span className="secondary-bold mg-b4">WhatsApp On</span>
                  <br />
                  +91 9289187070
                </p>
              </div>
              <div className="contact-block">
                <div className="block-icon">
                  <i className="icon-mail"></i>
                </div>
                <p className="size-14">
                  <span className="secondary-bold mg-b4">Email</span>
                  <br />
                  contactus@pramericalife.in
                </p>
              </div>
            </div>
            <div className="social-links">
              <p className="size-14">
                <span className="secondary-bold">Follow us on:</span>
              </p>
              <ul>
                <li>
                  <a href="https://www.facebook.com/PramericaLifeInsurance/">
                    <i className="icon-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/pramerica-life-insurance/">
                    <i className="icon-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/pramerica_lifeinsurance/">
                    <i className="icon-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-main dark-blue-bg">
        <div className="container">
          <p className="size-12 mg-b24">
            IRDAI Registration No.140. Category: Life. Validity: Valid.
            Pramerica Life Insurance Limited. CIN: U66000HR2007PLC052028.
          </p>
          <p className="size-12 mb-3">
            The Pramerica Life Mark displayed belongs to 'The Prudential
            Insurance Company of America' and is used by Pramerica Life
            Insurance Limited under license.
          </p>
          <p className="size-12 mg-b24">
            <span className="secondary-bold">
              BEWARE OF SPURIOUS / FRAUD PHONE CALLS:
            </span>{' '}
            IRDAI is not involved in activities like selling insurance policies,
            announcing bonus or investment of premiums. Public receiving such
            phone calls are requested to lodge a police complaint.
          </p>
          <div className="d-flex justify-content-between flex-column flex-sm-row">
            <p className="size-12 mb-2 mb-sm-3">
              &copy; Copyright 2023, All Rights Reserved.
            </p>
            <p className="size-12 mb-2 mb-sm-3">
              <a
                href={`https://devweb.pramericalife.in/index`}
                target="_blank"
                rel="noreferrer"
              >
                www.PramericaLife.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
