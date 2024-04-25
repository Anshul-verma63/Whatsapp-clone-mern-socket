import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;
const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

const users = [];
const addUser = (userData, socketId) => {
  !users.some((user) => user.sub == userData.sub) &&
    users.push({ ...userData, socketId });
};

const getUser = (userId) => {
  return users?.find((user) => user.sub == userId);
};

//socket io connection
io.on("connection", (socket) => {
  console.log("user connected");

  //add user
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);

    //getalluser- send to backend
    io.emit("getUsers", users);
  });

  //send sms
  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    io.to(user?.socketId).emit("getMessage", data);
  });
});
