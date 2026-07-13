import React, { useState, useEffect } from "react";
import api from "../ApiServices/Api";
const CreateGroup = () => {
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [nameError, setNameError] = useState("");
  const [privacyError, setPrivacyError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault()
    let isvalid = true;
    if (name.trim() == "") {
      setNameError("name field must not be empty");
      isvalid = false;
    }
    if (privacy == "") {
      setPrivacyError("you must select Privacy");
      isvalid = false;
    }
    if (!isvalid) return;
    try {
      const { data } = await api.post("/create/insertgroup", {
        privacy: privacy,
        name: name,
      });
      console.log(data);
    } catch (error) {
      console.log(error);      
    }
  };
  return (
    <>
        <form
          method="POST"
          noValidate
          onSubmit={(e) => handleSubmit(e)}
          className="mt-3 flex flex-col gap-3 bg-white border border-slate-200 rounded-xl p-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Enter Name of the Group
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
            {nameError && (
              <p className="mt-1 text-xs text-red-500">{nameError}</p>
            )}
          </div>

          <div>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
            >
              <option>Select Privacy</option>
              <option value="private">PRIVATE</option>
              <option value="public">PUBLIC</option>
            </select>
            {privacyError && (
              <p className="mt-1 text-xs text-red-500">{privacyError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all duration-150"
          >
            Create
          </button>
        </form>

    </>
  );
};

export default CreateGroup;