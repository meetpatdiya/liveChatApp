import React, { useState, useEffect } from "react";
import api from "../ApiServices/Api";

const UpdateGroup = (props) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const handleUpdate = async (name, image) => {
    try {
      const formData = new FormData();
      formData.append("grp_avatar", image);
      formData.append("grp_id", props.grp_id);
      formData.append("grp_name", name);
      const { data } = await api.post("/chat/updateGroup", formData);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mx-4 mt-4 mb-2 p-4 rounded-xl bg-white border border-slate-200">
      <p className="text-sm font-semibold text-slate-700 mb-3">
        Update group
      </p>
      <div className="flex flex-col gap-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Update group name"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
        />
        <button
          onClick={() => handleUpdate(name, image)}
          className="self-start px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateGroup;