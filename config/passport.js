const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')


// Get stuff back from passport, and use async to do things with that
module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, 
    async (accessToken, refreshToken, profile, done) => {
        //store google data in our database
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }

        //Check if user is already in database, if they are then we dont need to add them
        try {
            let user = await User.findOne({googleId: profile.id})

            if(user){
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        }
        catch (err) {
            console.log(err)
        }
    }))


    //Add serialize and deserialize user from passport docs
    //Hide and show user ID so we can look it up against the Database
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })
}