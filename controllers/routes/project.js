const express = require('express')
const bodyParser = require('body-parser')
const authMiddleware = require('../config/authMiddleware')
const multer = require('../config/multer')
const Medicine = require('../../models/medicine')
const router = express.Router()
const moment = require('moment')
const io = require('socket.io')
const s = require('../index')
const User = require('../../models/register')
const app = express()
var companyName
//router.use(authMiddleware)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// -----------------------------------------------------------------------------------------------------

router.get('/', authMiddleware, async (req, res) => {
  var userId = req.cookies.userId
  
  var user = await User.findOne({_id: userId})
  companyName = user.company_name

  res.render('includes/home', {company_name: companyName, title: 'Home', login: true, register: false, userId: userId})
})
// -----------------------------------------------------------------------------------------------------

router.get('/stock', authMiddleware, (req, res) => {
  res.render('includes/register_products', {company_name: companyName, title: 'Register Products', login: true})
})
// -----------------------------------------------------------------------------------------------------

router.post('/saveMedicine', authMiddleware, multer.single('image'), (req, res) => {
    Medicine.create({
      user: req.cookies.userId,
      bar_code: req.body.bar_code,
      name_medicine: req.body.name_medicine,
      description: req.body.description,
      lote: req.body.lote,
      shelf_life: req.body.shelf_life,
      acquired_value: req.body.acquired_value,
      sale_value: req.body.sale_value,
      amount: req.body.amount,
      image_name: req.file.originalname
    })
    res.redirect('stock')
})
// -----------------------------------------------------------------------------------------------------

router.get('/items-stock', authMiddleware, async (req, res) => {
  var userId = req.cookies.userId
  await Medicine.find({user: userId}).then((medicines) => {
    
    res.render('includes/stock', {company_name: companyName, title: 'Stock', login: true, medicines: medicines})
  }).catch((err) => {
    console.log(err);
  })
})
// -----------------------------------------------------------------------------------------------------

router.get('/sale', authMiddleware, (req, res) => {
  
  res.render('includes/sale', {company_name: companyName, title: 'Venda', login: true, userId: req.cookies.userId})
})
// -----------------------------------------------------------------------------------------------------
router.get('/aaa', authMiddleware, async (req, res) => {
  await Medicine.find().then((medicines) => {
    res.render('includes/sale', {medicines: medicines})
  }).catch((err) => {
    req.flash('error_msg', err)
  })
})
// -----------------------------------------------------------------------------------------------------

router.get('/update/:user/:bar_code', authMiddleware, async (req, res) => {
  var medicine = await Medicine.findOne({user: req.params.user, bar_code: req.params.bar_code})
  res.render('includes/update', {company_name: companyName, title: 'Update', medicine: medicine, login: true})
})
// -----------------------------------------------------------------------------------------------------

router.post('/updateMedicine/:user/:bar_code', authMiddleware, multer.single('image'), async (req, res) => {
  //O dia era diminuído em 1 ao atualizar
  var aux = moment(req.body.shelf_life).add(0, 'days')
  
  await Medicine.findOneAndUpdate({bar_code: req.params.bar_code}, {
    bar_code: req.body.bar_code,
    name_medicine: req.body.name_medicine,
    description: req.body.description,
    lote: req.body.lote,
    shelf_life: aux,
    acquired_value: req.body.acquired_value,
    sale_value: req.body.sale_value,
    amount: req.body.amount,
  })
  
  res.redirect('../../items-stock')
})
// -----------------------------------------------------------------------------------------------------

router.post('/deleteItem/:user/:bar_code', authMiddleware, async (req, res) => {
  await Medicine.findOneAndRemove({user: req.params.user, bar_code: req.params.bar_code})

  res.redirect('/items-stock')
})
// -----------------------------------------------------------------------------------------------------
router.get('/report', authMiddleware, (req, res) => {
  var userId = req.cookies.userId
  res.render('includes/report', {company_name: companyName, title: 'Relatório de Vendas', login: true, userId: userId})
})

module.exports = router
