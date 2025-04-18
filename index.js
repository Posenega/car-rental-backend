const express = require("express")
const http = require("http")
const cors = require("cors")
const logger = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const path = require("path")
const { initSocket } = require("./socket") // 👈 NEW

require("dotenv").config()

// Routes
const users = require("./routes/users")
const branch = require("./routes/branch")
const car = require("./routes/car")
const order = require("./routes/order")
const review = require("./routes/review")
const coupon = require("./routes/coupon")
const email = require("./routes/emails")

const app = express()
const server = http.createServer(app) // 👈 Socket needs raw server
initSocket(server) // 👈 Initialize socket server

app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)
app.use(logger("dev"))
app.use(bodyParser.json())
app.set("secretKey", "carRental")

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.log("DB Connection Error", err)
    process.exit(1)
  })

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/users", users)
app.use("/branch", branch)
app.use("/car", car)
app.use("/order", order)
app.use("/reviews", review)
app.use("/coupons", coupon)
app.use("/email", email)

const PORT = process.env.PORT || 8080
server.listen(PORT, function () {
  console.log(`Server is running on Port: ${PORT}`)
})
