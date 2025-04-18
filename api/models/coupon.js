const mongoose = require("mongoose")

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
})

module.exports = {
  CouponSchema: CouponSchema,
  couponModel: mongoose.model("Coupon", CouponSchema),
}
