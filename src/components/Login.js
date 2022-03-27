import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

const Login = () => {
  const [number, setNumber] = useState("");
  const [valid, setValid] = useState(true);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [wrongOtp, setWrongOtp] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [userid, setUserid] = useState("");
  const [otp, setOtp] = useState("");

  // Request an otp from the server
  const getOtp = () => {
    fetch("https://otp-login-server.herokuapp.com/get-otp", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: number,
        userid: userid,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setOtpRequested(true);
      });
  };

  // Send the username and OTP to our server to verify it
  const verifyOtp = (e) => {
    e.preventDefault();
    fetch("https://otp-login-server.herokuapp.com/verify-otp", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        otp: otp,
        userid: userid,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setOtpSuccess(data.isValidOtp);
        setWrongOtp(!data.isValidOtp);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(number + " submitted.");
    if (isValidPhoneNumber(number)) {
      console.log("Number is valid");
      setValid(true);
      if (userid !== "") {
        getOtp(number);
      }
    } else {
      console.log("Number is invalid");
      setValid(false);
    }
  };

  const handleChange = (e) => {
    setUserid(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="container py-3">
      <div className="card">
        {!otpRequested && (
          <form onSubmit={onSubmit} className="form-container">
            <h1 className="text-center">OTP Login</h1>
            <p className="text-center">Request an OTP to login</p>

            <input
              type="text"
              placeholder="Enter user ID"
              value={userid}
              onChange={handleChange}
            />
            <PhoneInput
              placeholder="Enter phone number"
              value={number}
              onChange={setNumber}
            />
            {!valid && !otpSuccess && (
              <p className="text-danger text-center">Number is not valid!</p>
            )}
            <div className="text-center">
              <input
                type="submit"
                value="Get OTP"
                className="btn btn-primary"
              />
            </div>
          </form>
        )}
        {otpRequested && !otpSuccess && (
          <form onSubmit={verifyOtp} className="form-container">
            <h1 className="text-center">OTP Login</h1>
            <p className="text-center">Enter OTP</p>
            <input
              type="text"
              placeholder="Enter the OTP you recieved"
              value={otp}
              onChange={handleOtpChange}
            />
            <div className="text-center">
              <input
                type="submit"
                value="Verify OTP"
                className="btn btn-primary"
              />
            </div>
            {wrongOtp && (
              <div className="text-center">
                <p className="text-danger">OTP does not match! Try Again.</p>
                <a href="/" className="text-center">
                  Or Request Another
                </a>
              </div>
            )}
          </form>
        )}
        {otpSuccess && (
          <div className="container">
            <h1 className="text-center">Welcome to the site!</h1>
            <p className="text-center">OTP Verified Successfully!</p>
            <i className="fa-solid fa-handshake-angle fa-4x icon-center py-2"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
