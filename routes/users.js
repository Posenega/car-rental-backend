const express = require("express")
const userController = require("../api/controllers/users")
const router = express.Router()

router.post("/login", userController.login)
router.post("/register", userController.register)
router.get("/refresh", userController.refreshToken)
router.get("/:userId", userController.fetchUserData)
router.delete("/signout", userController.signout)

module.exports = router
