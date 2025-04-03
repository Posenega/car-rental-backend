const mongoose = require("mongoose")

const BranchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  mapLocation: {
    type: Object,
    required: true,
  },
  branchImage: {
    type: String,
    required: true,
  },
})

module.exports = {
  BranchSchema: BranchSchema,
  branchModel: mongoose.model("Branch", BranchSchema),
}
