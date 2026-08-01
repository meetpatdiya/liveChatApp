import React, { useState, useEffect, Suspense } from "react";
import api from "../ApiServices/Api.js";
import { useNavigate, Outlet } from "react-router-dom";
import CreateGroup from "./CreateGroup.jsx";
import { io } from "socket.io-client";
import { useSocket } from "../Context/SocketContext";
import { useAuth } from "../Context/AuthContext";

const Dashboard = () => {
  const [data, setdata] = useState(null);
  const [search, setsearch] = useState("");
  const [output, setoutput] = useState({});
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { setIsAuthenticated } = useAuth();
  const socket = useSocket();
  console.log(socket);
  
  const handleLogout = async () => {
    try {
      const { data } = await api.post("/auth/logout");
      socket?.disconnect();
      localStorage.removeItem("userId");
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

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
        console.log(data);
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

  const handleJoinGroup = async (id) => {
    try {
      const { data } = await api.post("/create/insertgrpmembers", {
        grp_id: id,
        mem_id: userId,
      });
      console.log(data);
    } catch (error) {
      console.log(error?.response);
    }
  };

  useEffect(() => {
    getYourGroups();
  }, []);

useEffect(() => {
  console.log("Dashboard useEffect ran");
  console.log("socket:", socket?.id);

  if (!socket) {
    console.log("Socket is null");
    return;
  }

  const handleMessage = () => {
    console.log("Received newMessage");
    getYourGroups();
  };

  socket.on("newMessage", handleMessage);

  return () => {
    socket.off("newMessage", handleMessage);
  };
}, [socket]);

  const noResults =
    (!output.searchResult || output.searchResult.length === 0) &&
    (!output.searchResult2 || output.searchResult2.length === 0);

  return (
    <div className="h-screen flex bg-white">
      <div className="w-full md:w-95 shrink-0 border-r border-slate-200 flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 bg-emerald-600">
          <h1 className="text-white font-semibold text-lg">TalkNest</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateGroup((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-emerald-700/40 hover:bg-emerald-700/60 text-white flex items-center justify-center transition"
              title="New group"
            >
              +
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-white/90 hover:text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700/40 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {showCreateGroup && (
          <div className="border-b border-slate-200 bg-slate-50 p-4">
            <CreateGroup />
          </div>
        )}

        <div className="p-3 border-b border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setsearch(e.target.value)}
              placeholder="Search users or groups"
              className="flex-1 px-4 py-2 rounded-full bg-slate-100 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={searchUser}
              className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
            >
              Search
            </button>
          </div>

          {noResults && search.trim() !== "" && (output.searchResult || output.searchResult2) && (
            <p className="text-sm text-slate-400 mt-2 text-center">No user found</p>
          )}

          {(search && output.searchResult?.length > 0 || output.searchResult2?.length > 0) && (
            <div className="mt-3 flex flex-col gap-2 max-h-64 overflow-y-auto">
              {output.searchResult?.map((item, index) => (
                <div
                  key={`user-${index}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50"
                >
                  <img
                    src={item.avatar}
                    alt={item.username}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <p className="flex-1 text-sm font-medium text-slate-800 truncate">
                    {item.username}
                  </p>
                  {item.hasConversation != 1 ? (
                    <button
                      onClick={() => handleStartChatting(item.id)}
                      className="text-xs font-medium text-emerald-700 border border-emerald-200 rounded-full px-3 py-1.5 hover:bg-emerald-50 transition"
                    >
                      Start Chatting
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/chatdashboard/${item.conversationId}`)}
                      className="text-xs font-medium text-slate-600 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition"
                    >
                      View
                    </button>
                  )}
                </div>
              ))}

              {output.searchResult2?.map((item, index) => (
                <div
                  key={`group-${index}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50"
                >
                  <img
                    src={item.group_avatar}
                    alt={item.group_name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <p className="flex-1 text-sm font-medium text-slate-800 truncate">
                    {item.group_name}
                  </p>
                  {item.hasConversation != 1 ? (
                    <button
                      onClick={() => handleJoinGroup(item.id)}
                      className="text-xs font-medium text-emerald-700 border border-emerald-200 rounded-full px-3 py-1.5 hover:bg-emerald-50 transition"
                    >
                      Join Group
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/chatdashboard/${item.conversationId}`)}
                      className="text-xs font-medium text-slate-600 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition"
                    >
                      View
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {data === null && (
            <p className="text-center text-sm text-slate-400 mt-6">Loading chats...</p>
          )}
          {data?.length === 0 && (
            <p className="text-center text-sm text-slate-400 mt-6">No conversations yet</p>
          )}
          {data?.map((item, index) => (
            <div
              key={index}
              onClick={() =>{ navigate(`/chatdashboard/${item.id}`);
              setdata(prev=>prev.map(c=>c.id == item.id?{...c,unread_messages:0}:c))
            }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 transition"
            >
              <img
                src={item.display_avatar}
                alt={item.display_name}
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <p className="font-medium text-slate-800 truncate">{item.display_name}</p>
              <p>{item.unread_messages > 0 ? item.unread_messages:null}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:flex flex-1 flex-col bg-[#f0f2f5]">
        <Suspense
          fallback={<p className="m-auto text-slate-400 text-sm">Loading</p>}
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;

