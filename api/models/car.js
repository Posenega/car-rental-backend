const mongoose = require("mongoose")
const { Schema } = mongoose

// Nested schema for Insurance Prices
const InsurancePriceSchema = new Schema({
  full: {
    type: Number,
    default: 0,
  },
  tiresAndWindscreen: {
    type: Number,
    default: 0,
  },
  insuranceForDriver: {
    type: Number,
    default: 0,
  },
})

// Nested schema for Services Prices
const ServicesPriceSchema = new Schema({
  chauffeur: {
    type: Number,
    default: 0,
  },
  childSeat: {
    type: Number,
    default: 0,
  },
  sateliteNavigation: {
    type: Number,
    default: 0,
  },
  gps: {
    type: Number,
    default: 0,
  },
})

// Main schema for Car details
const CarSchema = new Schema({
  carName: {
    type: String,
    default: "",
  },
  carYear: {
    type: String,
    default: "",
  },
  engineType: {
    type: String,
    default: "",
  },
  engineRange: {
    type: String,
    default: "",
  },
  fuelType: {
    type: String,
    default: "",
  },
  transmission: {
    type: String,
    default: "",
  },
  branch: {
    type: String,
    default: "",
  },
  passengerCapacity: {
    type: String,
    default: "",
  },
  numberOfDoors: {
    type: String,
    default: "",
  },
  airConditioning: {
    type: String,
    default: "",
  },
  electricWindows: {
    type: String,
    default: "",
  },
  carImage: {
    type: String,
    default: "",
  },
  carRentalPrice: {
    type: Number,
    default: 0,
  },
  carDescription: {
    type: String,
    default: "",
  },
  tankPrice: {
    type: Number,
    default: 0,
  },
  insurancePrice: {
    type: InsurancePriceSchema,
    default: {},
  },
  servicesPrice: {
    type: ServicesPriceSchema,
    default: {},
  },
})

module.exports = {
  CarSchema: CarSchema,
  serviceModel: mongoose.model("ServicesPrice", ServicesPriceSchema),
  insuranceModel: mongoose.model(
    "InsurancePrice",
    InsurancePriceSchema
  ),
  carModel: mongoose.model("Car", CarSchema),
}
