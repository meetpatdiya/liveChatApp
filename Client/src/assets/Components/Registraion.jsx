import React, { useState, useEffect } from "react";
import api from "../ApiServices/Api.js";
import {useNavigate} from "react-router-dom"
const Registraion = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [errors, seterrors] = useState({});
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isvalid = true;
    let newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    if (!name || name.length < 3) {
      newErrors.name = "name is empty";
      isvalid = false;
    }
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email formate";
      isvalid = false;
    }
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "password must be 8 charachters long,one capital,one small,one digit and one special charachter";
      isvalid = false;
    }
    if (cpassword.length < 7 || cpassword !== password) {
      newErrors.cpassword =
        "It must be 8 charachters long and must be same as password";
      isvalid = false;
    }
    seterrors(newErrors || {});
    if (!isvalid) return;
    try {
      const { data } = await api.post("/auth/register", {
        name: name,
        email: email,
        password: password,
      });
      if(data.status == 200){
        navigate("/login")
      }
      console.log(data);
    } catch (error) {
      console.log(error?.response);
    }
  };
  return (
    <>
      <h1>hey my bro</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="r-name">Enter Name</label>
        <input
          type="text"
          value={name}
          id="r-name"
          onChange={(e) => setname(e.target.value)}
        />
        <br />
        <p>{errors.name}</p>
        <label htmlFor="r-email">Enter Email</label>
        <input
          type="email"
          value={email}
          id="r-email"
          onChange={(e) => setemail(e.target.value)}
        />
        <br />
        <p>{errors.email}</p>
        <label htmlFor="r-pass">Enter Password</label>
        <input
          type="password"
          value={password}
          id="r-pass"
          onChange={(e) => setpassword(e.target.value)}
        />
        <br />
        <p>{errors.password}</p>
        <label htmlFor="r-cpass">Confirm Password</label>
        <input
          type="password"
          value={cpassword}
          id="r-cpass"
          onChange={(e) => setcpassword(e.target.value)}
        />
        <p>{errors.cpassword}</p>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Registraion;
