const bcrypt = require('bcryptjs')
const mongoose = require('./database')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  company_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', async function(next){
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

const User = mongoose.model('users', userSchema)

module.exports = User
