const mongoose = require('./database')

const sale = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  bar_code: {
    type: String,
    required: true
  },
  name_medicine: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
  acquired_value: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Sale = mongoose.model('sales', sale)

module.exports = Sale