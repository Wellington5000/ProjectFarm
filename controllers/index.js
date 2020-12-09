const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const path = require('path')
const routerLogin = require('./routes/login')
const routerRegister = require('./routes/register')
const routerProject = require('./routes/project')
const Medicine = require('../models/medicine')
const Sale = require('../models/sales')
const moment = require('moment')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
var cookieParser = require('cookie-parser')
 
var store = new MongoDBStore({
  uri: 'mongodb+srv://wellington:22iasmin22@cluster0.qs0my.mongodb.net/projeto?retryWrites=true&w=majority',
  collection: 'mySessions'
});
 
app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));
 
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  next()
})

app.use(cookieParser())

//Body-Parser permite a obtenção dos dados do formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Configuração handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main', helpers: {
  formatDate: (date) => {
      return moment(date).format('YYYY-MM-DD')
  }
}}))
app.set('view engine', 'handlebars')

//Carrega a estilização e as imagens
app.use(express.static(path.join(__dirname, '../images/')))
app.use(express.static(path.join(__dirname, '../uploads/')))
app.use(express.static(path.join(__dirname, '../views/css')))
app.use(express.static(path.join(__dirname, '../views/scripts')))

//Configura rotas
app.use('/login', routerLogin)
app.use('/', routerProject)
app.use('/register', routerRegister)


io.on('connection', socket => {
  //Procura medicamento pelo nome
  socket.on('sendSearch', async (data) => {
    const medicines = await Medicine.findOne({user: data.userId, name_medicine: data.medicine})
    if(!medicines){
      socket.emit('receivedData', 'Medicamento não encontrado', false)
    } else{
      socket.emit('receivedData', medicines, true)
    }
  })

  //Salva a venda
  socket.on('saveSale', async (data) => {
    try {
      for(let i = 0; i < data.length; i++){
        if(data[i] != null){
          await Sale.create({
            user: data[i].user,
            bar_code: data[i].bar_code,
            name_medicine: data[i].name_medicine,
            amount: data[i].amount,
            acquired_value: data[i].acquired_value,
            price: data[i].sale_value
          })
          var medicine = await Medicine.findOne({bar_code: data[i].bar_code})
          var newAmount = medicine.amount - data[i].amount
          await Medicine.findOneAndUpdate({user: data[i].user, bar_code: data[i].bar_code}, {amount: newAmount})
        }
      }
      socket.emit('status', true, 'Data save with success') 
    } catch (error) {
      socket.emit('status', false, error)
    }
  })

  //--------------------------------------------------------------------------------------------  
  socket.on('searchReport', async (selectedElement, data, userId) => {
    switch (selectedElement){
      //Query através do código de barras
      case 0:
        var result = await Sale.find({user: userId, bar_code: data})
        socket.emit('resultSearch', result)
        break
      //Query através do nome do medicmento
      case 1:
        var result = await Sale.find({user: userId, name_medicine: data})
        socket.emit('resultSearch', result)
        break
      //Query através da data da venda
      case 2:
        //Adiciona mais um dia à data para a query ser realizada
        var aux = new Date(data.date2);
        var date2 = new Date();
        date2.setDate(aux.getDate() + 1);

        var result = await Sale.find({user: userId, date: { $gte: data.date1, $lte: date2}})
        socket.emit('resultSearch', result)
        break
      //Retorna todas as vendas
      case 3:
        console.log(data);
        var result = await Sale.find({user: userId})
        socket.emit('resultSearch', result)
        break
      //Query através do menos vendido
      case 5:
        var menor = 100000000, menosVendido = []
        var result = await Sale.find({user: userId})

        for(let i = 0; i < result.length; i++){
          var product = await Sale.count({bar_code: result[i].bar_code})
          if(product < menor){
            menosVendido = menosVendido.splice()
            menosVendido.push(result[i])
            menor = product
          } 
        }
        socket.emit('resultSearch', menosVendido)
        break
      //Query através do mais vendido
      case 4:
        var maior = 0, maisVendido = []
        
        var result = await Sale.find({user: userId})

        for(let i = 0; i < result.length; i++){
          var product = await Sale.count({bar_code: result[i].bar_code})
          if(product > maior){
            maisVendido = maisVendido.splice()
            maisVendido.push(result[i])
            maior = product
          } 
        }
        socket.emit('resultSearch', maisVendido)
        break
    }
  })

  socket.on('dataAll', async (userId) => {
    var dataAll = await Sale.find({user: userId})

    socket.emit('result', dataAll)
  })

})
var porta = process.env.PORT || 3000
server.listen(porta)
