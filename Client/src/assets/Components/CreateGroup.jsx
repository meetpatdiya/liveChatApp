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
      console.log(privacy);  
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
    <form method="POST" noValidate onSubmit={(e)=>handleSubmit(e)}>
      Enter Name of the Group:
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>{nameError}</p>
      <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
        <option>
          Select Privacy
        </option>
        <option value="private">PRIVATE</option>
        <option value="public">PUBLIC</option>
      </select>
      <button type="submit">Create Group</button>
    </form>
  );
};

export default CreateGroup;
