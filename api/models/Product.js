const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    imageUrl:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Genre:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Genre'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    mrp_price: {
        type: Number,
        required: true
    },
    selling_price: {
        type: Number,
        required: true
    },
    discount:{
        type: Number,
        required:true
    }, 
    size:{
            type:String,
            required:true
        },
    status:{
        type:Boolean,
        default:true
    },
    inventory:{
        type: Number,
        required:true
    },
},{versionKey:false});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;