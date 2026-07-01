const onlineUsers = new Map();

export const addUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

export const removeUser = (socketId) => {
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};

export const getSocketId = (userId) => {
  return onlineUsers.get(userId);
};

export const getOnlineUsers = () => {
  return [...onlineUsers.keys()];
};