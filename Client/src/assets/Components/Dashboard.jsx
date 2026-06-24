import React, { useState, useEffect, Suspense } from "react";
import api from "../ApiServices/Api.js";
import { useNavigate, Outlet } from "react-router-dom";
import CreateGroup from "./CreateGroup.jsx";
import { io } from "socket.io-client";
import AddProfilePicture from "./AddProfilePicture.jsx";
const Dashboard = () => {
  const [data, setdata] = useState(null);
  const [search, setsearch] = useState("");
  const [output, setoutput] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId")
  console.log(userId);
  
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      auth: {
        userId: localStorage.getItem("userId"),
      },
    });
    return () => socket.disconnect();
  }, []);
  const handleLogout = async ()=>{
    try {
      const {data} = await api.post("/auth/logout")
      localStorage.removeItem("userId");
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }
  const getYourGroups = async () => {
    try {
      const { data } = await api.get("/chat/getchat");      
      setdata(data);
      console.log(data);
    } catch (error) {
      console.log(error?.response);
    }
  };
  const searchUser = async () => {
    if (search.trim() != "") {
      try {
        const { data } = await api.post("/search/searchuser", { name: search });
        setoutput(data);
      } catch (error) {
        console.log(error?.response);
      }
    }
  };
  const handleStartChatting = async (id) => {
    try {
      const { data } = await api.post("/create/insertDirect", { cnv_id: id });
      console.log(data);
    } catch (error) {
      console.log(error?.response);
    }
  };
  useEffect(() => {
    getYourGroups();
  }, []);
  return (
    <>
      <div>
        <h1>Welcome to This Encrypted App  <button onClick={handleLogout}>Logout</button> </h1>
        <CreateGroup/> <br /> <hr />
        <AddProfilePicture />
        <input
          type="text"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
        />
        <button onClick={searchUser}>Search</button>
        {output.searchResult == "" && output.searchResult2 == ""
          ? "No user found"
          : ""}
        {output.searchResult && (
          <>
            {output.searchResult.map((item, index) => (
              <div>                
                <p>Name: {item.username}</p>
                <img src={item.avatar} alt="User's Avatar" height={200} />
                {item.hasConversation != 1 ? (
                  <button onClick={() => handleStartChatting(item.id)}>
                    Start Chatting
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      navigate(`/chatdashboard/${item.conversationId}`)
                    }
                  >
                    View Conversations
                  </button>
                )}
              </div>
            ))}
          </>
        )}
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              style={{ background: "red" }}
              onClick={() => navigate(`/chatdashboard/${item.id}`)}
            >
              <p>{item.display_name}</p>
              <img src={item.display_avatar} height="auto" width={200} />
            </div>
          );
        })}
      </div>
      <Suspense fallback={<p>Loading</p>}>
        <Outlet />  
      </Suspense>
    </>
  );
};
export default Dashboard;
