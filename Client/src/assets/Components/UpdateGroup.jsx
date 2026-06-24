import React, { useState, useEffect } from "react";
import api from "../ApiServices/Api";
const UpdateGroup = (props) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const handleUpdate = async (name, image) => {
    try {
      const formData = new FormData();
      formData.append("grp_avatar", image);
      formData.append("grp_id",props.grp_id);
      formData.append("grp_name",name)
      const { data } = await api.post("/chat/updateGroup", 
        formData);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="update group name"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={() => handleUpdate(name, image)}>update</button>
    </div>
  );
};

export default UpdateGroup;
