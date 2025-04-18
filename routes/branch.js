const express = require("express")
const branchController = require("../api/controllers/branch")
const { fileUpload } = require("../middleware/file-upload")
const router = express.Router()

router.post(
  "/create",
  fileUpload.single("branchImage"),
  branchController.create
)
router.get("/getAll", branchController.getBranches)
router.delete("/delete/:id", branchController.deleteBranch)
router.get("/:id", branchController.getBranch)

module.exports = router
