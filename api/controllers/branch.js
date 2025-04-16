const BranchModel = require("../models/branch").branchModel
const fs = require("fs")

async function create(req, res, next) {
  try {
    const body = req.body
    const file = req.file
    if (file) {
      const rawPath = file.path
      const normalizedPath = rawPath.replace(/\\/g, "/")
      body.branchImage = normalizedPath
    }
    body.mapLocation = JSON.parse(body.mapLocation)
    await BranchModel.create(body)
    res.status(200).json({
      message: "Branch created successfully",
      data: body,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    })
  }
}

async function getBranches(req, res, next) {
  try {
    const branches = await BranchModel.find()
    res.status(200).json({
      message: "Branches fetched successfully",
      data: branches,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    })
  }
}

async function deleteBranch(req, res, next) {
  try {
    const { id } = req.params
    await BranchModel.findByIdAndDelete(id).then((result) => {
      const imagePath = result.branchImage
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err)
        } else {
          console.log("Image deleted successfully.")
        }
      })
    })
    res.status(200).json({
      message: "Branch deleted successfully",
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
  create,
  getBranches,
  deleteBranch,
}
