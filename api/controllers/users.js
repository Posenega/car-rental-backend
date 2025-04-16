const userModel = require("../models/users").userModel
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
      console.log(password)
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Generate Access Token (Short-lived)
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
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
      sameSite: "strict",
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
      { expiresIn: "1h" }
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
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    await tokenModel.create({ userId: user._id, token: refreshToken })

    // Return the access token
    return res.status(201).json({ accessToken })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: err.message })
  }
}

const refreshToken = async (req, res) => {
  try {
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

const signout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      console.log(req.cookies)
      return res.status(401).json({ message: "Unauthorized" })
    }

    const storedToken = await tokenModel.findOne({
      token: refreshToken,
    })
    if (!storedToken) {
      return res.status(403).json({ message: "Forbidden" })
    }
    await tokenModel.findOneAndDelete({ token: refreshToken })

    return res.status(200).json({ message: "Signout Success" })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  if (!authHeader) {
    return res.status(401).json({ message: "Access token missing." })
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Access token missing." })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid access token." })
    }

    req.user = decoded
    next()
  })
}

const verifyAdmin = (req, res, next) => {
  // Assuming your token payload includes a "role" property
  if (req.user && req.user.role === "admin") {
    return next()
  }
  return res
    .status(403)
    .json({ message: "Access denied. Admins only." })
}

const uploadUserProfileImage = async (req, res) => {
  try {
    const { userId } = req.body
    const file = req.file

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Assuming you want to save the image path in the database
    const imagePath = `/uploads/userImage/${file.filename}`

    // Update user profile with the image path
    await userModel.findByIdAndUpdate(userId, { image: imagePath })

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      imagePath,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  login,
  register,
  refreshToken,
  fetchUserData,
  signout,
  verifyToken,
  verifyAdmin,
  uploadUserProfileImage,
}
