import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const NotFound = () => {
    const location = useLocation()
    const navigate = useNavigate()
    console.log(location);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto mb-8 w-20 h-20 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
            />
          </svg>
        </div>

        <h1 className="text-7xl font-bold tracking-tight text-emerald-600 mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          Page not found
        </h2>
        <h4 className="text-base text-slate-500 mb-10 leading-relaxed wrap-break-word">
          The page{" "}
          <span className="font-medium text-slate-700">
            /{location.pathname.slice(1)}
          </span>{" "}
          is not available
        </h4>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl bg-white text-emerald-700 font-medium border border-emerald-200 hover:bg-emerald-50 active:scale-[0.98] transition-all duration-150"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all duration-150 shadow-sm"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound