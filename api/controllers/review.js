const ReviewModel = require("../models/review").reviewModel;

async function createReview(req, res, next) {
    try {
        const body = req.body;
        const review = await ReviewModel.create(body);

        res.status(200).json({
            message: "Review created successfully",

        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
}

async function deleteReview(req, res, next) {
    try {
        const { id } = req.params;

        await ReviewModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Review deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
}

async function getReviews(req, res, next) {
    try {
        const { id } = req.params
        var reviews = []
        if (id !== undefined) {
            reviews = await ReviewModel.find({
                userId: id
            });
        } else {
            reviews = await ReviewModel.find();
        }
        res.status(200).json({
            message: "Reviews fetched successfully",
            data: reviews,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
}
module.exports = {
    createReview,
    getReviews,
    deleteReview,
};