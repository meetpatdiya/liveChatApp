import React, { useState, useEffect } from "react";
import api from "../ApiServices/Api.js";
import { useNavigate } from "react-router-dom";
const Registraion = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [errors, seterrors] = useState({});
  const navigate = useNavigate();
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

    if (password.length < 8 || !passwordRegex.test(password)) {
      newErrors.password =
        password.length < 8
          ? "Password must be at least 8 characters long"
          : "Password must contain one uppercase letter, one lowercase letter, one digit, and one special character";

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
      if (data.status == 200) {
        navigate("/login");
      }
      console.log(data);
    } catch (error) {
      console.log(error?.response);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg shadow-emerald-600/10 border border-emerald-100 p-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8 text-center">
            Register
          </h1>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="r-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                Enter Name
              </label>
              <input
                type="text"
                value={name}
                id="r-name"
                onChange={(e) => setname(e.target.value)}
                placeholder="Enter name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="r-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Enter Email
              </label>
              <input
                type="email"
                value={email}
                id="r-email"
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="r-pass" className="block text-sm font-medium text-slate-700 mb-1.5">
                Enter Password
              </label>
              <input
                type="password"
                value={password}
                id="r-pass"
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="r-cpass" className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={cpassword}
                id="r-cpass"
                onChange={(e) => setcpassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
              {errors.cpassword && (
                <p className="mt-1.5 text-sm text-red-500">{errors.cpassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all duration-150 shadow-sm mt-2"
            >
              Submit
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already Registered?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-700 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Registraion;