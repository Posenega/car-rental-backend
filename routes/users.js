const express = require("express")
const userController = require("../api/controllers/users")
const { fileUpload } = require("../middleware/file-upload")
const router = express.Router()

router.post("/login", userController.login)
router.post("/register", userController.register)
router.get("/refresh", userController.refreshToken)
router.get("/:userId", userController.fetchUserData)
router.delete("/signout", userController.signout)
router.put(
  "/uploadProfileImage",
  fileUpload.single("image"),
  userController.uploadUserProfileImage
)

module.exports = router
