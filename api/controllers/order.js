const Order = require("../models/order").orderModel
const Car = require("../models/car").carModel
const { couponModel } = require("../models/coupon")

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
    const orders = await Order.find({
      userId: req.params.userId,
      paymentStatus: "pending", // Only fetch pending orders
    })
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

const { generatePDF } = require("../../middleware/pdf-generator")
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

async function getOrder(req, res) {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      return res.status(404).json({
        message: "No order found",
      })
    }
    return res.status(200).json({
      message: "Order fetched successfully",
      order,
    })
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching order",
      error: err.message,
    })
  }
}

async function validateOrder(req, res) {
  try {
    const { couponCode } = req.body
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      return res.status(404).json({
        message: "No order found",
      })
    }
    if (couponCode) {
      const coupon = await couponModel.findOne({
        code: couponCode.toUpperCase(),
        used: false,
      })

      if (!coupon) {
        return res
          .status(404)
          .json({ message: "Invalid or already used coupon" })
      }

      // Apply discount
      order.totalPrice = Math.max(
        0,
        order.totalPrice * (coupon.discountAmount / 100)
      )

      // Mark coupon as used
      coupon.used = true
      await coupon.save()
    }
    const pdf = await generatePDF(order)
    order.paymentStatus = "paid"
    order.invoiceUrl = pdf.filePath
    console.log("Invoice URL:", pdf.filePath)
    console.log("New Order:", order.invoiceUrl)

    await order.save()
    return res.status(200).json({
      message: "Order validated successfully",
      order,
    })
  } catch (err) {
    console.error("Error validating order:", err)
    return res.status(500).json({
      message: "Error validating order",
      error: err.message,
    })
  }
}

async function makePDF(req, res) {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      return res.status(404).json({
        message: "No order found",
      })
    }
    const pdf = await generatePDF(order)
    return res.status(200).json({
      message: "PDF generated successfully",
      pdf,
    })
  } catch (err) {
    return res.status(500).json({
      message: "Error generating PDF",
      error: err.message,
    })
  }
}

async function getPaidOrders(req, res) {
  try {
    const { userId } = req.params
    // Optional: You can also verify the user has permission to delete this order
    const orders = await Order.find({
      userId: userId,
      paymentStatus: "paid",
    })
    if (!orders) {
      return res.status(404).json({ message: "Orders not found" })
    }
    return res.status(200).json({ message: "successfully", orders })
  } catch (err) {
    console.error("Error fetching orders:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params
    // Optional: You can also verify the user has permission to delete this order
    const deleted = await Order.findByIdAndDelete(orderId)
    if (!deleted) {
      return res.status(404).json({ message: "Order not found" })
    }
    return res
      .status(200)
      .json({ message: "Order deleted successfully" })
  } catch (err) {
    console.error("Error deleting order:", err)
    return res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  createOrder,
  getOrders,
  getMostReservedCarId,
  getOrder,
  validateOrder,
  deleteOrder,
  getPaidOrders,
  makePDF,
}
