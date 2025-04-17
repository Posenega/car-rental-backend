const express = require("express")
const orderController = require("../api/controllers/order")
const router = express.Router()

router.post("/create", orderController.createOrder)
router.get("/getAll/:userId", orderController.getOrders)
router.get(
  "/getMostReservedCarId",
  orderController.getMostReservedCarId
)

module.exports = router
