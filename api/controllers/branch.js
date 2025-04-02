const BranchModel = require("../models/branch").branchModel

async function create(req, res, next) {
  try {
    const body = req.body
    console.log(body)
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

module.exports = {
  create,
  getBranches,
}
