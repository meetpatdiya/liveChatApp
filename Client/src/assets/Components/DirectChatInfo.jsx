import React from 'react'
import { useParams,useOutletContext  } from 'react-router-dom';
import api from "../ApiServices/Api.js"

const DirectChatInfo = (props) => {

    const id  = useParams();
    const userData = props.data; 

    const handleBlockUser = async(req,res)=>{
      try {
        const {data} = await api.post("/block",{cnv_id:id.id});
        console.log(data);
        
      } catch (error) {
        console.log(error);
      }
    }   

  return (
    <div>
      <img src={userData.group_avatar} alt={userData.group_name} />
      <div>
        {userData.group_name}
        <div>{userData.user_email}</div>
        <button onClick={handleBlockUser}>Block</button>
      </div>
    </div>
  )
}

export default DirectChatInfo
