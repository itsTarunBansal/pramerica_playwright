import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import SashaktLogo from '../../../assets/Logo/sashaktlogo.png';
import { AppDispatch } from '../../../redux/store';
interface Props {
  setForgotPassword: any;
  changePassword: any;
}

const ForgotPassword: React.FC<Props> = ({
  setForgotPassword,
  changePassword,
}) => {
  const dispatch= useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const checkEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    if(checkEmail(email) ===false){
      return;
    }
    const body = {
      email: email,
    };
    await dispatch(changePassword(body));
    setEmail('');
    setMessage('Password reset link has been sent to your email');
  };
  return (
    <div className="container pos-relative">
      <div className="mx-842">
        <div className="cutomer-login-card">
          <div className="cutomer-login-left">
            <img src={SashaktLogo} alt="" />
          </div>
          <div className="cutomer-login-right">
            <div className="forgot-password" user-step id="forgotPassword">
              <div className="customer-titles">
                <h5>Forgot your password?</h5>
                <p className="size-14">
                  We’ll help you reset it and get back on track
                </p>
              </div>
              <div className="row rowgap-7">
                <div className="col-md-6">
                  <div className="form-group-new">
                    <label>Enter Email id*</label>
                    <input
                      onChange={(e: any) => setEmail(e.target.value.toLowerCase())}
                      autoComplete="off"
                      type="email"
                      className="form-control"
                      value={email}
                      placeholder="Email id"
                      required
                    />
                    {/* <span className="error-msgs">Invalid mobile number</span> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="action-btns">
              <Stack direction="row" spacing={2}>
                <button
                  onClick={handleForgotPassword}
                  className="btn btn-primary"
                  type="button"
                >
                  Process
                </button>
                <button
                  onClick={() => setForgotPassword(false)}
                  className="btn btn-yellow"
                  type="button"
                >
                  Login
                </button>
              </Stack>
            </div>
            <p style={{ color: 'green', marginTop: '30px' }}>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state: any) => ({});
export default connect(mapStateToProps, {})(ForgotPassword);
