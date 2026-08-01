import React, { useEffect, useState } from "react";
import UpdateGroup from "./UpdateGroup";
import AddUserInGroup from "./AddUserInGroup";
import { useParams, useOutletContext,useNavigate } from "react-router-dom";
import DirectChatInfo from "./DirectChatInfo";
import api from "../ApiServices/Api";

const ChatInfo = (props) => {
  const [grpUsers, setgrpUsers] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const { groupInfo, userInfo, isAdmin, isGroup, isPrivate } =
    useOutletContext();
  const id = useParams();
  const navigate = useNavigate()
  useEffect(() => {
    const getData = async () => {
      setLoadingMembers(true)
      try {
        const { data } = await api.get(`/chat/getgroupmembers/${id.id}`);
        setgrpUsers(data.result);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally{
        setLoadingMembers(false)
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
    <div className="h-full w-full flex flex-col bg-slate-50">
       <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <p className="text-sm font-semibold text-slate-800">
          {  "Chat Info"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-600 text-lg leading-none"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isGroup && isAdmin && <UpdateGroup grp_id={id} />}

        {isGroup && isAdmin && isPrivate && (
          <>
            <AddUserInGroup id={id} />

            <div className="mx-4 mb-4">
              <h2 className="text-sm font-semibold text-slate-700 mb-2">
                Group members
              </h2>
              <div className="flex flex-col gap-2">
                 {loadingMembers && (
                  <p className="text-xs text-slate-400 text-center py-2">
                    Loading members...
                  </p>
                )}
                {!loadingMembers && grpUsers.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-2">
                    No members found
                  </p>
                )}
                {!loadingMembers&& grpUsers &&
                  grpUsers.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200"
                    >
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {item.email}
                        </p>
                      </div>
                      <p
                        className={`text-xs font-medium whitespace-nowrap ${
                          item.is_online === 1
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {item.is_online === 1
                          ? "Online"
                          : new Date(item.last_seen).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {!isGroup && (
          <div className="p-4">
            <DirectChatInfo data={groupInfo} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition"
          >
            Clear Chat
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-500 text-center">
              This will permanently delete all messages. Are you sure?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleClearChat();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInfo;