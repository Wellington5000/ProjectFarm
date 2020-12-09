const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://wellington:22iasmin22@cluster0.qs0my.mongodb.net/projeto?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
//mongoose.Promise = global.Promise



module.exports = mongoose