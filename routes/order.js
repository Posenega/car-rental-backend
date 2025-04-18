const express = require("express")
const orderController = require("../api/controllers/order")
const router = express.Router()

router.post("/create", orderController.createOrder)
router.get("/getAll/:userId", orderController.getOrders)
router.get(
  "/getMostReservedCarId",
  orderController.getMostReservedCarId
)
router.get("/:orderId", orderController.getOrder)
router.post("/validate/:orderId", orderController.validateOrder)
router.delete("/:orderId", orderController.deleteOrder)
router.get("/paid/:userId", orderController.getPaidOrders)

module.exports = router
