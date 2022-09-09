// Import and create express router
const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
        //Can add these middleware as a third argument inside router.get('/', middlewarehere, (req, res))

const Story = require('../models/Story') //Add the Story Schema

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
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        //Hit the database and request this data, then convert it into json using lean()
        const stories = await Story.find({ user: req.user.id }).lean()

        //When stories data is recieved we'll render it and also call stories
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err){
        console.error(err)
        //Created custom 500 and 404 error pages in views folder
        res.render('error/500')
    }
   
})

//export route
module.exports = router