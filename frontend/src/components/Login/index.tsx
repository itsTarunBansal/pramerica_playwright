import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Header/header';
import PageTitle from './PageTitle';
import Footer from '../Footer/footer';
//import { loginMe, changePassword, adloginMe } from '../../features/auth/authActions';
import { AppDispatch } from '../../redux/store';
import LoginForm from './LoginForm';
// import { setSnackBar } from '../../features/snackbar/snackBarSlice';
import { useAxiosInterceptor } from '../../hooks/useAxiosInterceptor';
import CryptoJS from 'crypto-js';
const LoginPage = () => {
  useAxiosInterceptor();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState<any>('');
  const [password, setPassword] = useState<any>('');
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const ENCRYPTION_KEY = "a1389851174ecf2988ef0bedbe7139e8574a309de2df30b5fd690e5da71c1e6e"; // 32-byte (256-bit)
  const IV = "a333d71b769cf3ebb8c60b41274e85b4"; // 16-byte (128-bit)

  const encryptPassword = (text:any) => {
      const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
      const iv = CryptoJS.enc.Hex.parse(IV);
     
      const encrypted = CryptoJS.AES.encrypt(text, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
     
      return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    };
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const encryptedPass= encryptPassword(password)
    console.log('Login submitted');
    const body = {
      username: email,
      password: encryptedPass,
    };
    try {
      console.log('Dispatching login...');
      //await dispatch(adloginMe(body)); // Check if this is actually being called
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error); // Log any error here
      return error;
    }
  };
  return (
    <>
      <NavBar />
      <PageTitle />
      {/* <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        changePassword={changePassword}
      /> */}
      <Footer />
    </>
  );
};

export default LoginPage;
