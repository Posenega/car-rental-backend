const express = require("express")
const router = express.Router()
const { sendContactEmail } = require("../api/controllers/email")

router.post("/send", sendContactEmail)

module.exports = router
