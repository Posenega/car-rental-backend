const mongoose = require("mongoose")
const { Schema } = mongoose

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  // ✅ New fields from the form:
  fullName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
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
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  pickupTime: {
    type: String, // e.g., "12:30 PM"
    required: true,
  },
  fuelOption: {
    type: {
      type: String,
      enum: ["prepaid", "postpaid"],
    },
    price: { type: Number },
  },
  selectedInsurance: {
    full: { type: Number, default: 0 },
    tiresAndWindscreen: { type: Number, default: 0 },
    insuranceForDriver: { type: Number, default: 0 },
  },
  selectedServices: {
    chauffeur: { type: Number, default: 0 },
    childSeat: { type: Number, default: 0 },
    satelliteNavigation: { type: Number, default: 0 },
    gps: { type: Number, default: 0 },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  invoiceUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  car: {
    type: Object,
    default: {},
  },
})

module.exports = {
  OrderSchema: OrderSchema,
  orderModel: mongoose.model("Order", OrderSchema),
}
