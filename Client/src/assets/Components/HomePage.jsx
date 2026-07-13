import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-8 w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Welcome to TalkNest
          </h1>
          <h2 className="text-base text-slate-500 mb-10 leading-relaxed">
            It is live chat app made for users like you
          </h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/register")}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all duration-150 shadow-sm"
            >
              Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-xl bg-white text-emerald-700 font-medium border border-emerald-200 hover:bg-emerald-50 active:scale-[0.98] transition-all duration-150"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;