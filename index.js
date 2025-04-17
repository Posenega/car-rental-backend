const express = require("express")
const http = require("http")
const cors = require("cors")
const logger = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const users = require("./routes/users")
const branch = require("./routes/branch")
const car = require("./routes/car")
const review = require("./routes/review")

const path = require("path")
require("dotenv").config()

const app = express()
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
  .then(() => {
    console.log("DB Connected")
  })
  .catch((err) => {
    console.log("DB Connection Error", err)
    process.exit(1)
  })

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/users", users)
app.use("/branch", branch)
app.use("/car", car)
app.use("/reviews", review)

const PORT = process.env.PORT || 8080
app.listen(PORT, function () {
  console.log(`Server is running on Port: ${PORT}`)
})
