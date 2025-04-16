const express = require("express")
const carController = require("../api/controllers/car")
const { fileUpload } = require("../middleware/file-upload")
const router = express.Router()

router.post(
  "/create",
  fileUpload.single("carImage"),
  carController.createCar
)
router.get("/", carController.getAll)
router.get("/filtered", carController.getFilteredCars)
router.get("/category/:category", carController.getCarsByCategory)

module.exports = router
