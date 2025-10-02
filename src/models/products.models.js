const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        index: true,
    },
    code: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        index: true,
    },
    status: {
        type: Boolean,
        required: true,
        index: true,
    },
    stock: {
        type: Number,
        required: true,
        index: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    thumbnails: {
        type: String,
        required: true,
        index: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Products", productSchema);