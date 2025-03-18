const express = require("express")
const http = require("http")
const cors = require("cors")
const logger = require("morgan")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const users = require("./routes/users")
require("dotenv").config()

const app = express()
const server = http.createServer(app)

app.use(
  cors({
    origin: "http://localhost:3001",
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

app.use("/users", users)

const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log(`Server is running on Port: ${PORT}`)
})
