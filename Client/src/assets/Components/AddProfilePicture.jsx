import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import api from "../ApiServices/Api";
const AddProfilePicture = () => {
  const [image, setImage] = useState("");
  const [imgError, setImgError] = useState("");
  const [chngImg, setchngImg] = useState(false);
  const userId = localStorage.getItem("userId");
  const handleImage = (e) => {
    setImage(e.target.files[0])
  };
  const handleProfileChange = async () => {
    if (!image) {
      setImgError("Please choose a image");
      return;
    } else {
      setImgError("");
    }    
    try {
      const formData = new FormData();
      formData.append("profile", image);
      const { data } = await api.post(
        `/user/profile-picture/${userId}`,
        formData,
      );
      console.log(data)
      if(data.success){
        setImage("")
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <div className="border-b border-slate-200 bg-white">
      <button
        onClick={() => setchngImg((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
      >
        <span className="flex items-center gap-2">
          <Camera size={16} className="text-emerald-600" />
          Change profile image
        </span>
        <span className="text-xs text-slate-400">
          {chngImg ? "Hide" : "Edit"}
        </span>
      </button>

      {chngImg && (
        <div className="mx-4 mb-3 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
          <label
            htmlFor="profile-upload"
            className="flex flex-col items-center justify-center gap-1.5 px-4 py-5 rounded-xl border-2 border-dashed border-slate-300 bg-white text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40 transition"
          >
            <Camera size={22} className="text-slate-400" />
            <span className="text-sm text-slate-600 break-all">
              {image ? image.name : "Click to choose an image"}
            </span>
            <span className="text-xs text-slate-400">PNG, JPG or WEBP</span>
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />

          {imgError && (
            <p className="text-xs text-red-500 -mt-1">{imgError}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setchngImg(false);
                setImage("");
                setImgError("");
              }}
              className="flex-1 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleProfileChange}
              className="flex-1 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 active:scale-[0.98] transition"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProfilePicture;
