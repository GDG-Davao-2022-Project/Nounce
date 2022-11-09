import "./Login.module.scss"
import logo from "../../assets/img/logo.png"
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {auth, db} from '../../firebase-config';  
import {getDocs, where, collection, addDoc, query} from 'firebase/firestore';
import {RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

function Login() {
  const countryCode = "+639";
  const [phoneNumber, setPhoneNumber] = useState(countryCode);
  const [expandForm, setExpandForm] = useState(false);
  const [OTP, setOTP] = useState("");  
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  
  //replace 09 with +639 at the start regex
  const e164 = (num:string) => {
    if (num.substring(0, 2) == "09") 
      return countryCode + num.substring(2);
    return num
  }

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);
  
  const verifyOTP = (e:any) => {
    let otp = e.target.value;
    setOTP(otp); 
    if(otp.length === 6) {
      window.confirmationResult.confirm(otp).then((result:any) => {
        const myPhone = query(collection(db, "users"), where("number", "==", e164(phoneNumber)));
        getDocs(myPhone).then((querySnapshot:any) => {
          if (querySnapshot.empty) {
            addDoc(collection(db, "phones"), {
              number: e164(phoneNumber),
              isBanned: false,
              isOptedIn: true,
              createdAt: new Date()
            });
          }
        });
        console.log(result.user);
      }).catch((error:any) => {
        console.log(error);
        alert("Invalid OTP");
      })
    } 
  }
  
  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier("auth-container", {
      'size': "invisible",
      'callback': (response:any) => {
      }
    }, auth); 
  }
  
  const requestOTP = (e:any) => {
    e.preventDefault();
    if (phoneNumber.length < 11 || (phoneNumber.substring(0, 3) !== countryCode && phoneNumber.substring(0, 2) !== "09")) {
      alert("Please enter a valid phone number");
      return;
    }
      
    generateRecaptcha();
    signInWithPhoneNumber(auth, e164(phoneNumber), window.recaptchaVerifier)
    .then(confirmationResult => {
      setExpandForm(true);
      window.confirmationResult = confirmationResult;  
    })
    .catch(err => {
      console.error(err);
      console.log(err.message);
    });
  }

  return ( 
      <section>
          <img src={logo} alt="logo" />
          <h1>Welcome Back!</h1>
          {
            expandForm === true ?
              <div>
                <input type="number" maxLength={6} id="otpInput" value={OTP} onChange={verifyOTP} placeholder="Enter your OTP:"/>
                <button type="submit">
                  <p>Verify</p>
                </button>
              </div>
            : 
              <form onSubmit={requestOTP}>
                <input onChange={(e:any) => setPhoneNumber(e.target.value)}
                    type="tel" placeholder="Phone Number"/>
                <button type="submit">
                  <p>Sign In</p>
                </button>
              </form>
          } 

          <div id="auth-container"></div>
      </section> 
  );
}

export default Login;