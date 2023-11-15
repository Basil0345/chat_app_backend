const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
app.use(express.json())    // <==== parse request body as JSON

dotenv.config();

connectDB()

app.get("/", (req, res) => {
    res.send("API is Running...")
})

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes)

app.use("/api/message", messageRoutes)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 6000,
    cors: {
        origin: "http://localhost:3000"
    },
})

io.on("connection", (socket) => {
    console.log("connected to socket.io")
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {   //join room
        socket.join(room)
        console.log("user joined room " + room)
    })

    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    })

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    })

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.user not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })

    })

    socket.off("setup", () => {
        console.log("user disconnected");
        socket.leave(userData._id)
    })
})