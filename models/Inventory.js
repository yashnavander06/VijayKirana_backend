const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sizes: {
        type: String,
        required: true  
    }, 
    inventory:{
        type: Number,
        required:true
    },
},{versionKey:false});

const Inventory = mongoose.model('Inventory', InventorySchema);
module.exports = Inventory;