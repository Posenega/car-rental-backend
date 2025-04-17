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
    const { entry } = req.params

    var cars = []
    if (entry !== "undefined") {
      cars = await CarModel.find({
        carName: { $regex: entry, $options: "i" } // "i" for case-insensitive
      });
    } else {
      cars = await CarModel.find();

    }
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

async function getFilteredCars(req, res) {
  try {
    const filters = req.query // or wherever the filters are coming from
    console.log(filters)
    const query = {}

    // Type (exact match)
    if (filters.type) {
      query.type = filters.type
    }

    // Price range (filter fixed price field)
    if (
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    ) {
      query.carRentalPrice = {}
      if (filters.minPrice !== undefined)
        query.carRentalPrice.$gte = JSON.parse(filters.minPrice)
      if (filters.maxPrice !== undefined)
        query.carRentalPrice.$lte = JSON.parse(filters.maxPrice)
    }

    // Engine Range (as string, still filterable if converted to number)
    if (
      filters.minEngineSize !== undefined ||
      filters.maxEngineSize !== undefined
    ) {
      query.engineRange = {}

      // Assuming engineRange is a number in a string format (like "1.6" or "2.0")
      const min = parseFloat(filters.minEngineSize)
      const max = parseFloat(filters.maxEngineSize)

      if (!isNaN(min) || !isNaN(max)) {
        query.engineRange = {
          $gte: JSON.parse(filters.minEngineSize),
          $lte: JSON.parse(filters.maxEngineSize),
        }
      }
    }

    // Number of doors (exact match)
    if (filters.numberOfDoors) {
      query.numberOfDoors = filters.numberOfDoors
    }

    // Passenger capacity (exact match)
    if (filters.numberOfPassengers) {
      query.passengerCapacity = {
        $gte: parseInt(filters.numberOfPassengers),
      }
    }

    // Fuel type
    if (filters.fuelType) {
      query.fuelType = filters.fuelType
    }

    // Transmission
    if (filters.gearboxType) {
      query.transmission = filters.gearboxType
    }

    // Air Conditioning (true/false stored as string like "true"/"false")
    if (filters.ac !== undefined) {
      query.airConditioning = filters.ac.toString()
    }

    // Electric Windows (true/false stored as string like "true"/"false")
    if (filters.electricWindows !== undefined) {
      query.electricWindows = filters.electricWindows.toString()
    }

    console.log("Query: ", query)

    // Final query
    const cars = await CarModel.find(query)
    return res.status(200).json({ message: "success", cars })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message, cars: [] })
  }
}

async function getCarsByCategory(req, res) {
  try {
    const category = req.params.category
    // non case sensitive search
    console.log(category)
    const cars = await CarModel.find({
      type: { $regex: new RegExp(category, "i") },
    })
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

async function getCarById(req, res) {
  try {
    const carId = req.params.id
    const car = await CarModel.findById(carId)
    if (!car)
      return res
        .status(404)
        .json({ message: "Car not found", car: null })
    return res.status(200).json({ message: "success", car })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message, car: null })
  }
}

async function getAverageRentalPrice(req, res) {
  try {
    const result = await CarModel.aggregate([
      {
        $group: {
          _id: null, // ← required placeholder
          averagePrice: { $avg: "$carRentalPrice" },
        },
      },
    ])
    console.log(result)

    return res
      .status(200)
      .json(result.length ? result[0].averagePrice : 0)
  } catch (err) {
    console.error("Error calculating average rental price:", err)
    return res.status(500).json({
      message: "Error calculating average rental price",
      error: err.message,
    })
  }
}

module.exports = {
  createCar,
  getAll,
  getFilteredCars,
  getCarsByCategory,
  getCarById,
  getAverageRentalPrice,
}
