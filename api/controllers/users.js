const userModel = require("../models/users").usreModel
const bcrypt = require("bcrypt")
const tokenModel = require("../models/token")
const jwt = require("jsonwebtoken")
const fs = require("fs")

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Generate Access Token (Short-lived)
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    )

    // Generate Refresh Token (Long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    )

    // Store the refresh token in the database (or cache)
    await tokenModel.create({ userId: user._id, token: refreshToken })

    // Send access & refresh token (secure refresh in httpOnly cookie)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })

    return res.status(200).json({ accessToken })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const register = async (req, res) => {
  try {
    const { userName, password, email } = req.body

    // Hash the password before storing it

    // Create user
    const user = await userModel.create({
      userName,
      email,
      password,
    })

    // Generate Access Token (Short-lived)
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    )

    // Generate Refresh Token (Long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    )

    // Store Refresh Token in Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents frontend JavaScript access (XSS protection)
      secure: false, // Only send over HTTPS
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // Return the access token
    return res.status(201).json({ accessToken })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

const refreshToken = async (req, res) => {
  try {
    console.log("hello")
    console.log(req.cookie)
    const { refreshToken } = req.cookies
    if (!refreshToken)
      return res.status(401).json({ message: "Unauthorized" })

    const storedToken = await tokenModel.findOne({
      token: refreshToken,
    })
    if (!storedToken)
      return res.status(403).json({ message: "Forbidden" })

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ message: "Invalid refresh token" })

        const newAccessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        )

        return res.status(200).json({ accessToken: newAccessToken })
      }
    )
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const fetchUserData = async (req, res) => {
  try {
    // use params
    const token = req.headers["authorization"]?.split(" ")[1] // Extract Bearer token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    user.password = undefined
    return res.status(200).json({ user })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  login,
  register,
  refreshToken,
  fetchUserData,
}
