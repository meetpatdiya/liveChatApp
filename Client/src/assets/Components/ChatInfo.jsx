import React, { useEffect, useState } from "react";
import UpdateGroup from "./UpdateGroup";
import AddUserInGroup from "./AddUserInGroup";
import { useParams, useOutletContext } from "react-router-dom";
import DirectChatInfo from "./DirectChatInfo";
import api from "../ApiServices/Api";

const ChatInfo = (props) => {
  const [grpUsers, setgrpUsers] = useState([]);
  const { groupInfo, userInfo, isAdmin, isGroup, isPrivate } =
    useOutletContext();
  const id = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await api.get(`/chat/getgroupmembers/${id.id}`);
        setgrpUsers(data.result);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    isGroup && getData();
  }, []);
  const handleClearChat = async () => {
    try {
      const { data } = await api.post("/chat/clearchat", { cnv_id: id.id });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isGroup && isAdmin && <UpdateGroup grp_id={id} />}
      {isGroup && isAdmin && isPrivate && (
        <>
          <AddUserInGroup id={id} />
          <h2>Group members</h2>
          {grpUsers &&
            grpUsers.map((item, idx) => (
              <div key={item.id}>
                <img src={item.avatar} alt="" />
                Name: {item.name}
                Email: {item.email}
                {item.is_online === 1
                  ? "ONLINE"
                  : new Date(item.last_seen).toLocaleString()}
              </div>
            ))}
        </>
      )}
      {!isGroup && (
        <div>
          hey it is not group we are in priate chat
          <DirectChatInfo data={groupInfo} />
        </div>
      )}
      <button onClick={handleClearChat}>Clear Chat</button>
    </>
  );
};

export default ChatInfo;
