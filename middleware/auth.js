// In this file we create functions that protect our routes and prevent unauthorized access to dashboard logged in page. 
// Then we can add them to use elsewhere in our routes/index.js

module.exports = {
    //If user is authenticated than continue on to the next middleware otherwise redirect unauthorized users to homepage
    ensureAuth: function (req, res, next){
        if(req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    // If user logged in already and try to go to login page, we dont want to go back to login page, instead we redirect them to /dashboard page. Otherwise, if they aren't logged in and try to go to login let them continue next
    ensureGuest: function (req, res, next){
        if(req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}