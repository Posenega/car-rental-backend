const couponModel = require("../models/coupon").couponModel

async function validateCoupon(req, res, next) {
  try {
    const { code } = req.params

    const coupon = await couponModel.findOne({
      code: code.toUpperCase(),
    })

    if (!coupon) {
      return res.status(404).json({
        message: "Invalid coupon code",
        valid: false,
      })
    }

    res.status(200).json({
      message: "Coupon is valid",
      valid: true,
      discountAmount: coupon.discountAmount,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    })
  }
}

module.exports = {
  validateCoupon,
}
