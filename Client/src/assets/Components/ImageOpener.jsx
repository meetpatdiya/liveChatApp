import React from "react";
import { X } from "lucide-react";

const ImageOpener = ({ imgOpener, onclick }) => {
  return (
    <div
      onClick={onclick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <button
        onClick={onclick}
        className="absolute top-5 right-5 text-white hover:text-emerald-400 transition"
      >
        <X size={28} />
      </button>

      <img
        src={imgOpener?.imgUrl}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
      />
    </div>
  );
};

export default ImageOpener;