const { Server } = require("socket.io")
const { generateBotReply } = require("./services/ai")

let io

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // allow your frontend domain in production
    },
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("userMessage", async (data) => {
      const response = await generateBotReply(data.message)
      socket.emit("botReply", { reply: response })
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })
}

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized")
  return io
}

module.exports = { initSocket, getIO }
