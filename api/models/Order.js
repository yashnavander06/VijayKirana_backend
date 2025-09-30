// Order.js (Mongoose schema)

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      selling_price: {
        type: Number,
        required: true
      },
      quantity:{
       type: Number,
        required: true 
      }
    }
  ],   
status: {
  type: String,
  enum: ['pending', 'confirmed', 'cancelled'],
  default: 'pending'
},
stage: {
  type: String,
  enum: ['received', 'on_the_way', 'delivered', ''],
  default: ''
},
  orderDate: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

module.exports = mongoose.model('Order', OrderSchema);
