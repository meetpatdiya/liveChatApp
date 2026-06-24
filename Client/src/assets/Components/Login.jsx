import React, { useState, useEffect } from "react";
import api from "../ApiServices/Api.js";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [errors, seterrors] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErros = {};
    let isvalid = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || email.trim() == "") {
      isvalid = false;
      newErros.email = "Email field is required";
    } else if (!emailRegex.test(email)) {
      isvalid = false;
      newErros.email = "Invalid Email formate";
    }
    if (!password || password.length < 8) {
      isvalid = false;
      newErros.password = "Minimum length of Password should be 8";
    }
    seterrors(newErros);
    if (!isvalid) return;
    try {
      const data = await api.post("/auth/login", {
        email: email,
        password: password,
      });
      if (data.status === 200) {
        navigate("/chatdashboard");
        localStorage.setItem("userId", data.data.id);
      }
    } catch (error) {
      console.log(error.response);
      if (error.response?.status === 401) {
        console.log(error.response.data.message);
       seterrors({
      password: error.response.data.message,
    });
      }
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)} noValidate>
      <label htmlFor="l-email">Enter Email</label>
      <input
        type="email"
        value={email}
        id="l-email"
        className="border"
        onChange={(e) => setemail(e.target.value)}
      />
      <p>{errors.email}</p>
      <label htmlFor="l-password">Enter Password</label>
      <input
        type="password"
        value={password}
        className="border"
        id="l-password"
        onChange={(e) => setpassword(e.target.value)}
      />
      <p>{errors.password}</p>
      <button className="border" type="submit">
        Submit
      </button>
    </form>
  );
};

export default Login;
