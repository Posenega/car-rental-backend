const express = require("express");
const reviewController = require("../api/controllers/review");
const router = express.Router();

router.post("/create", reviewController.createReview);

router.get("/", reviewController.getReviews);

router.delete("/:id", reviewController.deleteReview);
router.get("/:id", reviewController.getReviews);

module.exports = router;