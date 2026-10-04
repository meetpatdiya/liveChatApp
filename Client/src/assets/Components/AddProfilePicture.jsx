import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
    <>
    <button onClick={()=>setchngImg(p=>!p)}>Change Profile Image</button>
      {chngImg && (
        <>
          <input type="file" accept="image/*" onChange={handleImage} />
          <p>{imgError}</p>
          <button onClick={handleProfileChange} className="border">
            Change Not
          </button>
        </>
      )}
    </>
  );
};

export default AddProfilePicture;
