import React, { useState, useRef } from 'react';
import SashaktLogo from '../../../assets/Logo/sashaktlogo.png';
import ForgotPassword from './forgotPassword';
import { connect } from 'react-redux';
import ButtonHoc from '../../Shared/Button/ButtonHoc';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
interface Props {
  email: any;
  setEmail: any;
  password: any;
  setPassword: any;
  handleLogin: any;
  changePassword: any;
}

const LoginFormContainer: React.FC<Props> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  changePassword,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggle

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event.key);
    if (event.key === 'Enter' && buttonRef.current) {
      buttonRef.current.click(); // Trigger the button's click event
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <section className="customer-portal-box advisor-portal-box">
      {forgotPassword ? (
        <ForgotPassword
          setForgotPassword={setForgotPassword}
          changePassword={changePassword}
        />
      ) : (
        <div className="container pos-relative">
          <div className="mx-842">
            <div className="cutomer-login-card">
              <div className="cutomer-login-left">
                {/* <img src={SashaktLogo} alt="" /> */}
              </div>
              <div className="cutomer-login-right">
                <div className="d-flex pd-b28 pd-x-b24">
                  <h4 className="nav-item">
                    Welcome to Pramerica Life insurance
                  </h4>
                </div>
                <div className="tab-content" id="myTabContent">
                  <div className="tab-pane fade show active" id="userName">
                    <div className="customer-login-wrapper jsLoginSection">
                      <div className="row rowgap-7">
                        <div className="col-md-6">
                          <div className="form-group-new">
                            <label>Login with your Employee ID*</label>
                            <div className="form-texts">
                              <input
                                onChange={(e: any) => setEmail(e.target.value.toUpperCase())}
                                onKeyDown={handleEnterKey}
                                autoComplete="off"
                                inputMode="text"
                                type="text"
                                className="form-control"
                                value={email}
                                placeholder="Employee ID"
                                style={{ textTransform: 'uppercase' }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group-new">
                            <label>Enter password*</label>
                            <div className="form-texts">
                              <div className="password-wrapper" style={{ position: 'relative' }}>
                                <input
                                  onChange={(e: any) =>
                                    setPassword(e.target.value)
                                  }
                                  style={{
                                    paddingRight: '40px',
                                  }}
                                  onKeyDown={handleEnterKey}
                                  autoComplete="new-password"
                                  type={passwordVisible ? 'text' : 'password'} 
                                  className="form-control"
                                  value={password}
                                  placeholder="Password"
                                />
                                <div
                                  onClick={togglePasswordVisibility}
                                  style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {passwordVisible ? (
                                    <VisibilityOffIcon  color='inherit'/>
                                  ) : (
                                    <VisibilityIcon color='inherit' />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="forgot-links"
                        style={{ cursor: 'pointer' }}
                      >
                        <a
                          onClick={() => setForgotPassword(true)}
                          className="link-size12"
                        >
                          Forgot password?
                        </a>
                      </div>

                      <div className="action-btns">
                        <ButtonHoc
                          className="btn btn-primary"
                          size="lg"
                          variantType="solid"
                          buttonType="submit" // use `buttonType` instead of `type`
                          color="primary"
                          onClick={handleLogin}
                          sx={{ backgroundColor: '#007bc3', color: '#ffffff' }}
                        >
                          Proceed
                        </ButtonHoc>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const mapStateToProps = (state: any) => ({});

export default connect(mapStateToProps, {})(LoginFormContainer);
