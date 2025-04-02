const express = require("express")
const branchController = require("../api/controllers/branch")
const router = express.Router()

router.post("/create", branchController.create)
router.get("/getAll", branchController.getBranches)

module.exports = router
