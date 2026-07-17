const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    itemcode: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    },
    farmerId: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        default: ""
    },
    cardLast4: {
        type: String,
        default: ""
    },
    paymentStatus: {
        type: String,
        default: "Unpaid"
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
