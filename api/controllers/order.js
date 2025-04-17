const Order = require("../models/order").orderModel
const Car = require("../models/car").carModel

async function createOrder(req, res) {
  try {
    // console.log(req.body)
    var insurance = {
      full: 0,
      tiresAndWindscreen: 0,
      insuranceForDriver: 0,
    }
    if (req.body.insuranceOption.label.includes("Full")) {
      insurance.full = req.body.insuranceOption.price
    } else if (req.body.insuranceOption.label.includes("Tires")) {
      insurance.tiresAndWindscreen = req.body.insuranceOption.price
    } else if (
      req.body.insuranceOption.label.includes("Additional")
    ) {
      insurance.insuranceForDriver = req.body.insuranceOption.price
    }
    var fuelOption = {
      type: "",
      price: 0,
    }
    if (req.body.fuelOption.label.includes("Prepaid")) {
      fuelOption.type = "prepaid"
      fuelOption.price = req.body.fuelOption.price
    } else if (req.body.fuelOption.label.includes("Return")) {
      fuelOption.type = "postpaid"
      fuelOption.price = req.body.fuelOption.price
    }

    const order = new Order({
      selectedInsurance: insurance,
      selectedServices: req.body.addons,
      fuelOption: fuelOption,
      // Personal Info
      userId: req.body.userId,
      fullName: req.body.fullName,
      age: req.body.age,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      // Reservation Info

      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      pickupTime: req.body.pickupTime,

      // Car info (optional - for frontend usage)
      carId: req.body.car._id,
      car: req.body.car || {},

      // Pricing
      totalPrice: req.body.totalPrice,
      paymentStatus: "pending",

      // Options
      fuelOption: fuelOption,

      selectedInsurance: insurance,

      selectedServices: req.body.addons,

      invoiceUrl: "",
    })

    await order.save()
    return res.status(201).json({
      message: "Order created successfully",
      order,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: "Error creating order",
      error: err.message,
    })
  }
}

async function getOrders(req, res) {
  try {
    const orders = await Order.find({ userId: req.params.userId })
    if (!orders) {
      return res.status(404).json({
        message: "No orders found",
      })
    }
    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    })
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching orders",
      error: err.message,
    })
  }
}

const car = require("../models/car")
const { orderModel } = require("../models/order")

async function getMostReservedCarId(req, res) {
  try {
    const result = await orderModel.aggregate([
      {
        $group: {
          _id: "$carId", // group by carId
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // sort descending by count
      { $limit: 1 }, // top 1
    ])
    var carExists = null
    if (result.length === 0) {
      return null
    } else {
      // Check if the carId exists in the Car collection
      carExists = await Car.findById(result[0]._id)
      if (!carExists) {
        return res.status(404).json({
          message: "No car found with the most reservations",
        })
      }
    }

    return res
      .status(200)
      .json({ message: "success", car: carExists }) // this is the most reserved carId
  } catch (err) {
    console.error("Failed to get most reserved carId:", err)
    return res.status(500).json({
      message: "Error fetching most reserved carId",
      error: err.message,
    })
  }
}

module.exports = {
  createOrder,
  getOrders,
  getMostReservedCarId,
}
