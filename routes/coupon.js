const express = require("express")
const router = express.Router()
const { validateCoupon } = require("../api/controllers/coupon")

router.get("/validate/:code", validateCoupon)

module.exports = router
