const multer = require("multer")
const uuid = require("uuid")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
}

const fileUpload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 100,
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = req.body.mypathtofolder || "images" // fallback to 'images' if not provided
      const uploadPath = `uploads/${folder}`
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype] || "webp"
      const fileName = uuid.v1() + "." + ext
      cb(null, fileName)
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]
    let error = isValid ? null : new Error("Invalid mime type")
    cb(error, isValid)
  },
})

module.exports = {
  fileUpload,
}
