const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const saltRounds = parseInt(process.env.SALT_ROUNDS)
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

UserSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds)
  next()
})
module.exports = {
  UserSchema: UserSchema,
  userModel: mongoose.model("User", UserSchema),
}
