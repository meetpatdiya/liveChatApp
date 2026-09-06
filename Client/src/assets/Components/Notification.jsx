import React, { useState, useEffect } from "react";
import api from "../ApiServices/Api";
import { useSocket } from "../Context/SocketContext";
import { X, Heart, AtSign, Bell } from "lucide-react";

const Notification = ({ onClick }) => {
  const [notificationData, setNotificationData] = useState([]);
  const socket = useSocket();
  const getNotificationData = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const { data } = await api.get(`/chat/notification/${userId}`);
      console.log(data.data);
      setNotificationData(data.data);
    } catch (error) {
      console.log("notification error: ", error);
    }
  };
  useEffect(() => {
    getNotificationData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      getNotificationData();
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket]);
  return (
    <div className="h-full w-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 border-b border-slate-200 bg-white">
        <h2 className="text-black font-semibold text-lg flex items-center gap-2 ">
          Notifications
        </h2>
        <button
          onClick={onClick}
          className="w-8 h-8 flex items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-700/40 hover:text-white transition"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notificationData?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <Bell size={32} className="text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">No notifications yet</p>
          </div>
        )}

        {notificationData?.map((item, idx) => {
          const getTimeAgo = (createdAt) => {
            const diff = Date.now() - new Date(createdAt).getTime();

            const seconds = Math.floor(diff / 1000);

            if (seconds < 60) return `${seconds}s ago`;

            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;

            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;

            const days = Math.floor(hours / 24);
            return `${days}d ago`;
          };
          const timeAgo = getTimeAgo(item.created_at);
          return (
            <div
              key={idx}
              className="flex items-start gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition"
            >
              {item.type === "reaction" ? (
                <div className="w-9 h-9 shrink-0 rounded-full bg-pink-50 flex items-center justify-center">
                  <Heart size={16} className="text-pink-500" />
                </div>
              ) : item.type === "mention" ? (
                <div className="w-9 h-9 shrink-0 rounded-full bg-sky-50 flex items-center justify-center">
                  <AtSign size={16} className="text-sky-500" />
                </div>
              ) : (
                <div className="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                  <Bell size={16} className="text-slate-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 leading-snug">
                  {item.type === "reaction" ? (
                    <>
                      <span className="font-medium text-slate-900">
                        {item.name}
                      </span>{" "}
                      reacted to your message
                    </>
                  ) : item.type === "mention" ? (
                    <>
                      <span className="font-medium text-slate-900">
                        {item.name}
                      </span>{" "}
                      mentioned you in chat
                    </>
                  ) : null}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notification;
