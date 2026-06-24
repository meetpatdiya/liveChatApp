import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../ApiServices/Api";
import { io } from "socket.io-client";
import UpdateGroup from "./UpdateGroup";

const ViewChats = () => {
  const [groupInfo, setgroupInfo] = useState({});
  const [chats, setchats] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [inpt, setinpt] = useState("");
  const [addUserInpt, setaddUserInpt] = useState("");
  const [addData, setaddData] = useState([]);
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const userId = Number(localStorage.getItem("userId"));
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io("http://localhost:3000", {
      auth: {
        userId: localStorage.getItem("userId"),
      },
    });
    return () => socket.current.disconnect();
  }, []);

  const getMessages = async () => {
    try {
      const { data } = await api.post("/chat/getmessages", { id: id });
      if (data.messages != null) {
        console.log(data.messages);

        setchats(data?.messages);
      } else {
        setchats([]);
      }
      console.log(data);
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

  const getSearchedData = async () => {
    try {
      const { data } = await api.get(
        `/create/checkMembers/${addUserInpt}/${id}`,
      );
      setaddData(data.data);
    } catch (error) {
      console.log(error.response);
    }
  };
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

  const addToGroup = async (userId) => {
    try {
      const { data } = await api.post("/create/insertgrpmembers", {
        grp_id: id,
        mem_id: userId,
      });
      console.log(data);
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

  useEffect(() => {
    if (!socket.current) return;
    const handleMessage = (msg) => {
      if (msg.conversation_id == id) {
        setchats((prev) => [...prev, msg]);
      }
    };

    socket.current.on("newMessage", handleMessage);

    return () => {
      socket.current.off("newMessage", handleMessage);
    };
  }, [id]);

  useEffect(() => {
    if (!socket.current) return;

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
    socket.current.on("userOnline", handleOnline);
    socket.current.on("userOffline", handleOffline);

    return () => {
      socket.current.off("userOnline", handleOnline);
      socket.current.off("userOffline", handleOffline);
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
    <div>
      <h1>
        {userInfo?.is_online
          ? "online"
          : "Last seen: " + new Date(userInfo?.last_seen).toLocaleString()}
      </h1>
      <div>
        {groupInfo?.group_name}
        <img src={groupInfo?.group_avatar} alt="" height={200} />
      </div>
      <div>
        <h2>chats</h2>
        <div>
          <div>
            {chats.length > 0 &&
              chats.map((item, index) => {
                const isSender = item.sender_id == userId;
                const fileIndex = item.message.indexOf("/chatFiles/")
                const fileName =item.message.substring(fileIndex+11)
                const currentDate = new Date(
                  item.created_at,
                ).toLocaleDateString();

                const previousDate =
                  index > 0
                    ? new Date(chats[index - 1].created_at).toLocaleDateString()
                    : null;

                const showDateBadge = currentDate !== previousDate;

                const time = new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={index}>
                    {showDateBadge && <div>{currentDate}</div>}
                    <div style={{ color: isSender ? "green" : "red" }}>
                      {item.message_type == "text" ? (
                        <div>{item.message}</div>
                      ) : item.message_type == "file" ?
                       (
                        <a href={item.message} target="_blank">{fileName}</a>
                      ) : (
                        <img src={item.message} width={200} />
                      )}

                      <small>{time}</small>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <label htmlFor="file-upload">📎</label>
        <input
          id="file-upload"
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          hidden
          onChange={handleFile}
        />
        <input
          type="text"
          value={inpt}
          onChange={(e) => setinpt(e.target.value)}
        />
        <button onClick={() => handleSendMessage(inpt, "text")}>Send</button>
        {isGroup && isAdmin && isPrivate && (
          <div>
            Hello admin you can add members
            <input
              type="text"
              className="border"
              value={addUserInpt}
              onChange={(e) => setaddUserInpt(e.target.value)}
            />
            {addData.length > 0 &&
              addData.map((item) => (
                <div key={item.id}>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-20 rounded-3xl"
                  />
                  <p>Name: {item.name}</p>
                  <p>Email: {item.email}</p>
                  {item.has_connection ? (
                    <p>User Already in the group</p>
                  ) : (
                    <button
                      className="border "
                      onClick={() => addToGroup(item.id)}
                    >
                      Add to group
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
        {isGroup && isAdmin && (
          <div>
            Yo this is group and you are the admin so you can change the profile picture here
            <UpdateGroup grp_id={id}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewChats;
