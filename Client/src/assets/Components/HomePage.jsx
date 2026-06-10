import React from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../ApiServices/Api.js"
const HomePage = () => {
  const navigate = useNavigate()
  
  return (
    <>
      hey Register to start <button onClick={()=>navigate("/register")}>Register Now</button>
      if you have Registered then do Login <br /> <button onClick={()=>navigate("/login")}>Login</button>
      <button onClick={()=>navigate("/chatdashboard")}>check</button>
    </>
  )
}

export default HomePage
