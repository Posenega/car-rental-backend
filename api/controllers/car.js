const { parse } = require("path")

const CarModel = require("../models/car").carModel
const ServicesPriceModel = require("../models/car").serviceModel
const InsurancePriceModel = require("../models/car").insuranceModel

async function createCar(req, res) {
  try {
    const body = req.body
    body.insurancePrice = JSON.parse(body.insurancePrice)
    body.servicesPrice = JSON.parse(body.servicesPrice)

    let servicesPrice = {
      chauffeur: parseFloat(body.servicesPrice.chauffeur),
      childSeat: parseFloat(body.servicesPrice.childSeat),
      sateliteNavigation: parseFloat(
        body.servicesPrice.sateliteNavigation
      ),
      gps: parseFloat(body.servicesPrice.gps),
    }
    let insurancePrice = {
      full: parseFloat(body.insurancePrice.full),
      tiresAndWindscreen: parseFloat(
        body.insurancePrice.tiresAndWindscreen
      ),
      insuranceForDriver: parseFloat(
        body.insurancePrice.insuranceForDriver
      ),
    }

    const servicesPriceModel = new ServicesPriceModel(servicesPrice)
    const insurancePriceModel = new InsurancePriceModel(
      insurancePrice
    )
    const file = req.file
    if (file) {
      const rawPath = file.path
      const normalizedPath = rawPath.replace(/\\/g, "/")
      body.carImage = normalizedPath
    }
    const carModel = new CarModel({
      carName: body.carName,
      carYear: body.carYear,
      engineType: body.engineType,
      engineRange: body.engineRange,
      fuelType: body.fuelType,
      transmission: body.transmission,
      passengerCapacity: body.passengerCapacity,
      numberOfDoors: body.numberOfDoors,
      airConditioning: body.airConditioning,
      electricWindows: body.electricWindows,
      carImage: body.carImage,
      carRentalPrice: parseFloat(body.carRentalPrice),
      carDescription: body.carDescription,
      tankPrice: parseFloat(body.tankPrice),
      servicesPrice: servicesPriceModel,
      insurancePrice: insurancePriceModel,
    })
    await carModel.save()
    return res
      .status(201)
      .json({ message: "Car created successfully" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

async function getAll(req, res) {
  try {
    const cars = await CarModel.find()
    if (!cars)
      return res
        .status(404)
        .json({ message: "No cars found", cars: [] })
    return res.status(200).json({ message: "success", cars })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message, cars: [] })
  }
}

module.exports = {
  createCar,
  getAll,
}
