import React from "react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full text-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-emerald-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-slate-700 mb-2">
        TalkNest
      </h2>
      <p className="text-sm text-slate-400 max-w-xs">
        Select a chat from the list to start messaging
      </p>
    </div>
  );
};

export default NoChatSelected;  