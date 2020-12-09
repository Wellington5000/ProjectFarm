const express = require('express')
const bodyParser = require('body-parser')
const User = require('../../models/register')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')
const router = express.Router()
const app = express()

function gerateToken(params = {}){
  return jwt.sign(params, authConfig.secret, {expiresIn: 86400})
}

//Body-Parser permite a obtenção dos dados do formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

router.get('/', (req, res) => {
  res.render('includes/login', {title: 'Login', login: false})
})

router.post('/auth', async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({email}).select('+password')

  if(!user){
    req.flash('error_msg', 'Nome de Usuário Inválido')
    return res.redirect('/')
  }

  if(!await bcrypt.compare(password, user.password)){
    req.flash('error_msg', 'Senha Inválida')
    return res.redirect('/')
  }
  
  user.password = undefined
  
  //Expiração em 10 dias
  res.cookie('userId', user.id, { maxAge: 900000000, httpOnly: true })
  res.cookie('token', gerateToken({id: user.id}), { maxAge: 900000000, httpOnly: true })
  res.redirect('/')
})

router.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.clearCookie('token')
  res.clearCookie('io')
  res.redirect('/login')
})

module.exports = router