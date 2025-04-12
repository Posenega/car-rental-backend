const mongoose = require("mongoose")
const { Schema } = mongoose

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // assuming you have a User model
    required: true,
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: "Car", // reference to your Car model
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
    required: true,
  },
  selectedInsurance: {
    full: { type: Boolean, default: false },
    tiresAndWindscreen: { type: Boolean, default: false },
    insuranceForDriver: { type: Boolean, default: false },
  },
  selectedServices: {
    chauffeur: { type: Boolean, default: false },
    childSeat: { type: Boolean, default: false },
    sateliteNavigation: { type: Boolean, default: false },
    gps: { type: Boolean, default: false },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  invoiceUrl: {
    type: String, // can be a full URL or a path (e.g., /invoices/order123.pdf)
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = {
  OrderSchema: OrderSchema,
  orderModel: mongoose.model("Order", OrderSchema),
}
