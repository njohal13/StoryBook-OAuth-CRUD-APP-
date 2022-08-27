// Import and create express router
const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
        //Can add these middleware as a third argument inside router.get('/', middlewarehere, (req, res))



//Setup routes and then use them in app.js

// @description Login/Landing Page
// @route Route GET /

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// @desc Dashboard 
// @route GET /dashboard
router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard')
})

//export route
module.exports = router