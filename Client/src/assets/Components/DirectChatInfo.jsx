import React from "react";
import { useParams, useOutletContext } from "react-router-dom";
import api from "../ApiServices/Api.js";

const DirectChatInfo = (props) => {
  const id = useParams();
  const userData = props.data;

  const handleBlockUser = async (req, res) => {
    try {
      const { data } = await api.post("/block", { cnv_id: id.id });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white border border-slate-200">
      <img
        src={userData.group_avatar}
        alt={userData.group_name}
        className="w-20 h-20 rounded-full object-cover mb-4"
      />
      <p className="text-lg font-semibold text-slate-900">
        {userData.group_name}
      </p>
      <p className="text-sm text-slate-400 mt-1">{userData.user_email}</p>
      <button
        onClick={handleBlockUser}
        className="mt-5 px-5 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
      >
        Block
      </button>
    </div>
  );
};

export default DirectChatInfo;