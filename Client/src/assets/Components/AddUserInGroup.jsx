import React, { useState, useEffect } from "react";
import api from "../ApiServices/Api";
const AddUserInGroup = ({id}) => {
  const [addData, setaddData] = useState([]);
  const [addUserInpt, setaddUserInpt] = useState("");
  const cnv_id = id.id;  
  const getSearchedData = async () => {
    try {
      const { data } = await api.get(
        `/create/checkMembers/${addUserInpt}/${cnv_id}`,
      );
      console.log(data.data);
      setaddData(data.data);
    } catch (error) {
      console.log(error);
    }
  }; 
  
  const addToGroup = async (userId) => {
    try {
      const { data } = await api.post("/create/insertgrpmembers", {
        grp_id: id,
        mem_id: userId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (addUserInpt.trim().length >= 2) {
        getSearchedData();
      } else {
        setaddData([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [addUserInpt]);
  return (
        <div className="mx-4 mb-2 p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-2">
            Hello admin you can add members
          </p>
          <input
            type="text"
            value={addUserInpt}
            onChange={(e) => setaddUserInpt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
          />
          {addData.length > 0 && (
            <div className="flex flex-col gap-2">
              {addData.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">{item.email}</p>
                  </div>
                  {item.has_connection ? (
                    <p className="text-xs text-slate-400">Already in group</p>
                  ) : (
                    <button
                      onClick={() => addToGroup(item.id)}
                      className="text-xs font-medium text-emerald-700 border border-emerald-200 rounded-full px-3 py-1.5 hover:bg-emerald-50 transition"
                    >
                      Add to group
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
  );
};

export default AddUserInGroup;
