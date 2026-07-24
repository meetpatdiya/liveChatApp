import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate, Outlet,useLocation } from "react-router-dom";
import api from "../ApiServices/Api";
import { io } from "socket.io-client";
import UpdateGroup from "./UpdateGroup";
import { useSocket } from "../Context/SocketContext";

const ViewChats = () => {
  const [groupInfo, setgroupInfo] = useState({});
  const [chats, setchats] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [isBlocked, setisBlocked] = useState(false)
  const [inpt, setinpt] = useState("");
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const userId = Number(localStorage.getItem("userId"));
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const showInfo =location.pathname.endsWith("/info")

  useEffect(() => {
    if (!socket) return;
    console.log("Emit messagesRead", socket.connected, id);
    socket.emit("messagesRead", {
      conversationId: id,
    });
  }, [socket, id]);

  const getMessages = async () => {
    try {
      const { data } = await api.post("/chat/getmessages", { id: id });
      if (data.messages != null) {
        setchats(data?.messages);
      } else {
        setchats([]);
      }
      console.log(data);
      setisBlocked(data.isBlocked)
      setgroupInfo(data?.grpinfo[0]);
      setUserInfo(data?.lsnSeen[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const isGroup = groupInfo?.type == "group";
  const isAdmin = groupInfo?.created_by == userId;
  const isPrivate = groupInfo?.privacy == "private";

  useEffect(() => {
    getMessages();
  }, [id]);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [chats]);

  const handleFile = async (e) => {
    const selectedFile = e.target.files[0];
    const formData = new FormData();
    const fileType = selectedFile.type.startsWith("image/") ? "image" : "file";
    formData.append("imgchat", selectedFile);
    formData.append("cnv_id", id);
    formData.append("snd_id", userId);
    formData.append("msg_type", fileType);
    console.log(selectedFile);
    try {
      const data = await api.post("/chat/sendimages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("messagesDelivered", ({ receiverId }) => {
      if (userInfo?.id === receiverId) {
        getMessages();
      }
    });

    return () => {
      socket.off("messagesDelivered");
    };
  }, [socket, userInfo?.id]);

  useEffect(() => {
    const handleMessage = (msg) => {
      if (msg.conversation_id == id) {
        setchats((prev) => [...prev, msg]);
        socket.emit("messagesRead", {
          conversationId: id,
        });
      }
    };

    socket.on(`newMessage_${id}`, handleMessage);

    return () => {
      socket.off(`newMessage_${id}`, handleMessage);
    };
  }, [id, socket]);

  useEffect(() => {
    console.log(
      "Emitting messagesRead",
      "user:",
      localStorage.getItem("userId"),
      "conversation:",
      id,
    );
    console.log("hey");
    if (!socket) return;
    socket.emit("messagesRead", {
      conversationId: id,
    });
    const handleMessagesRead = ({ conversationId }) => {
      if (id == conversationId) {
        getMessages();
      }
    };
    socket.on("messagesRead", handleMessagesRead);
    return () => {
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const handleOnline = (onlineUserId) => {
      if (onlineUserId == userInfo?.id) {
        setUserInfo((prev) => ({
          ...prev,
          is_online: 1,
        }));
      }
    };

    const handleOffline = ({ userId, lastSeen }) => {
      if (userId == userInfo?.id) {
        setUserInfo((prev) => ({
          ...prev,
          is_online: 0,
          last_seen: lastSeen,
        }));
      }
    };
    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
    };
  }, [userInfo?.id]);

  const handleSendMessage = async (message, msg_type) => {
    try {
      if (message.trim() !== "") {
        await api.post("/chat/sendmessage", {
          cnv_id: id,
          snd_id: userId,
          msg: message,
          msg_type: msg_type,
        });
        setinpt("");
        getMessages();
      }
    } catch (error) {
      console.log(error?.response);
    }
  };

  return (
    <>
      {!showInfo ? (
        <div className="flex flex-col h-full">
          <div
            onClick={() =>  navigate("info")}
            className="flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-200"
          >
            <img
              src={groupInfo?.group_avatar}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-slate-800">
                {groupInfo?.group_name}
              </p>
              <p className={`text-xs ${userInfo?.is_online ?"text-green-600 font-bold":"text-slate-400"}`}>
                {userInfo?.is_online
                  ? "online"
                  : "Last seen: " +
                    new Date(userInfo?.last_seen).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1">
            {chats.length > 0 &&
              chats.map((item, index) => {
                const isSender = item.sender_id == userId;
                const fileIndex = item.message.indexOf("/chatFiles/");
                const fileName = item.message.substring(fileIndex + 11);
                const Dats = new Date(item.created_at).toLocaleDateString();

                const previousDate =
                  index > 0
                    ? new Date(chats[index - 1].created_at).toLocaleDateString()
                    : null;

                const showDateBadge = Dats !== previousDate;

                const time = new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={index} className="flex flex-col">
                    {showDateBadge && (
                      <div className="mx-auto my-3 px-3 py-1 rounded-full bg-white shadow-sm text-xs text-slate-500">
                        {Dats}
                      </div>
                    )}
                    <div
                      className={`max-w-[65%] rounded-xl px-3 py-2 mb-1.5 shadow-sm ${
                        isSender
                          ? "self-end bg-emerald-100 text-slate-800"
                          : "self-start bg-white text-slate-800"
                      }`}
                    >
                      {item.message_type == "text" ? (
                        <p className="text-sm whitespace-pre-wrap wrap-break-word">
                          {item.message}
                        </p>
                      ) : item.message_type == "file" ? (
                        <a
                          href={item.message}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-emerald-700 underline break-all"
                        >
                          {fileName}
                        </a>
                      ) : (
                        <img
                          src={item.message}
                          className="rounded-lg max-w-full"
                          width={200}
                        />
                      )}
                      <small className="block text-right text-[10px] text-slate-400 mt-1">
                        {time} {isSender && item.status}
                      </small>
                    </div>
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-white border-t border-slate-200">
            <label
              htmlFor="file-upload"
  className={`text-xl transition ${
    isBlocked
      ? "cursor-not-allowed opacity-50 text-slate-400"
      : "cursor-pointer text-slate-500 hover:text-emerald-600"
  }`}       >       📎
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              hidden
              onChange={handleFile}
              disabled={isBlocked}
            />
            <input
              type="text"
              disabled={isBlocked}
              value={inpt}
              onChange={(e) => setinpt(e.target.value)}
              placeholder="Type a message"
              className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
            disabled = {isBlocked}
              onClick={() => handleSendMessage(inpt, "text")}
              className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition  disabled:bg-gray-400
             disabled:cursor-not-allowed
             disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <Outlet context={{groupInfo,userInfo,isAdmin,isGroup,isPrivate}}/>
      )}
    </>
  );
};

export default ViewChats;
