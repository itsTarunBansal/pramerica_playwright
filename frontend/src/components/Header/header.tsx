import { useState } from 'react';
import BrandLogo from '../../assets/images/brand-logo.svg';
const NavBar = () => {
  const [loginDrop, setLoginDrop] = useState<boolean>(false);
  const [mouseEvent, setMouseEvent] = useState<boolean>(false);
  const MouseOver = (event: any) => {
    setMouseEvent(true);
  };
  const MouseOut = (event: any) => {
    setMouseEvent(false);
  };
  return (
    <section className="top-section has-bg pd-b0">
      <header className="header">
        <div className="header-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-3 col-md-2">
                <div className="brand-logo">
                  {/* <a href="/" className="brand"> */}
                    <img src={BrandLogo} alt="brand" />
                  {/* </a> */}
                </div>
              </div>
              <div className="col-9 col-md-10">
                <div className="header-right">
                  <nav className="main-menu jsMainMenu">
                    <div className="inner-wrap">
                      <div className="menu-header d-block d-md-none">
                        <div className="row align-items-center">
                          <div className="col-6">
                            <div className="brand-logo">
                              {/* <a href="/" className="brand"> */}
                                <img src={BrandLogo} alt="brand" />
                              {/* </a> */}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="close-menu ms-auto">
                              <a
                                href="javascript:;"
                                className="close jsCloseMenubar"
                              >
                                <i className="icon-plus"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </section>
  );
};
export default NavBar;
