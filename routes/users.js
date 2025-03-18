const express = require("express")
const userController = require("../api/controllers/users")
const router = express.Router()

router.post("/login", userController.login)
router.post("/register", userController.register)
router.post("/refresh", userController.refreshToken)
router.get("/:userId", userController.fetchUserData)

module.exports = router
