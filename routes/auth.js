const express = require('express')
const passport = require('passport')
const router = express.Router()


//Authentication routes

// @description Auth with Google
// @route Route GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile']}))


// @description Google auth callback
// @route Route GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), 
    (req, res) => {
        res.redirect('/dashboard')
})



//@desc Logout User
//@route /auth/logout
// From the passport docs - Logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err){
        if(err) {return next(err)}
        res.redirect('/')
    })
} )




// Add the auth route to app.js




//export this module router
module.exports = router