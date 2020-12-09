const express = require('express')
const bodyParser = require('body-parser')
const User = require('../../models/register')

const router = express.Router()
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

router.get('/', (req, res) => {
	res.render('includes/register', {title: 'Register', register: true})
})

router.post('/saveUser', (req, res) => {
	User.create({
		name: req.body.name,
		email: req.body.email,
		company_name: req.body.company_name,
		password: req.body.password
	})
	//req.flash('success_msg', 'CADASTRO REALIZADO COM SUCESSO')
	res.redirect('/')
})

module.exports = router