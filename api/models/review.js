const mongoose = require("mongoose");
const { Schema } = mongoose;
const ReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        default: "",
    },
    date: {
        type: Date,
        default: Date.now()
    },
    image: {
        type: String,
        default: "",
    },
    text: {
        type: String,
        required: true,
        default: "",
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
});

module.exports = {
    ReviewSchema: ReviewSchema,
    reviewModel: mongoose.model("Review", ReviewSchema),
};