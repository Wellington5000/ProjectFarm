const mongoose = require('./database')

const medicineSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  lote: {
    type: String,
    required: true
  },
  shelf_life: {
    type: Date,
    required: true
  },
  acquired_value: {
    type: Number,
    required: true
  },
  sale_value: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  image_name: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Medicine = mongoose.model('medicines', medicineSchema)

module.exports = Medicine