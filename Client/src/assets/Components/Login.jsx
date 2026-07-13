import React, { useState, useEffect } from "react";
import api from "../ApiServices/Api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [errors, seterrors] = useState({});
  const navigate = useNavigate();
  const {setIsAuthenticated} = useAuth()
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
        setIsAuthenticated(true)
        localStorage.setItem("userId", data.data.id);
        navigate("/chatdashboard");
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
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg shadow-emerald-600/10 border border-emerald-100 p-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8 text-center">
          Login
        </h1>
        <form onSubmit={(e) => handleSubmit(e)} noValidate className="flex flex-col gap-5">
          <div>
            <label htmlFor="l-email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Enter Email
            </label>
            <input
              type="email"
              value={email}
              id="l-email"
              placeholder="Enter email"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              onChange={(e) => setemail(e.target.value)}
              />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="l-password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Enter Password
            </label>
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              id="l-password"
              onChange={(e) => setpassword(e.target.value)}
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all duration-150 shadow-sm mt-2"
            type="submit"
          >
            Submit
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
           Don't have an account? 
            <button
              onClick={() => navigate("/register")}
              className="text-emerald-700 font-medium hover:underline"
            >
             Register
            </button>
          </p>
      </div>
    </div>
  );
};

export default Login;