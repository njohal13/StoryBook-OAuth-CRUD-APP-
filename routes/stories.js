// Import and create express router
const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
        //Can add these middleware as a third argument inside router.get('/', middlewarehere, (req, res))
const Story = require('../models/Story') //Add the Story Schema


//Setup routes and then use them in app.js with app.use()
// @description     Show Add Page
// @route Route     GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @description     Process Add Form
// @route Route     POST /stories
// ------ POST Interactions with database require async function------
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
})


// @description    Show All Stories
// @route Route    GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean() //converts from mongoose to json format for handlebars

        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    } 
})

// @description    Show Single Story
// @route Route    GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean() //converts from mongoose to json format for handlebars
        
        if (!story) {
            return res.render('error/404')
        }

        res.render('stories/show', {
            story
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    } 
})



// @description    Show Edit page 
// @route Route    GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ 
            _id: req.params.id 
        }).lean() //converts from mongoose to json format for handlebars

        if (!story) {
            return res.render('error/404')
        }
        //extra security, make sure logged in user only gets access to their stories
        if(story.user != req.user.id) {
            res.redirect('/stories')

        //render new page called edit after ensuring proper user is accessing request
        } else {
            res.render('stories/edit', {
                story,
            })
        }
    
    } catch (err) {
        console.error(err)
        res.render('error/500')
    } 
})

// @description     Update story
// @route Route     PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
    let story = await Story.findById(req.params.id).lean()

    if (!story){
        return res.render('error/404')
    }

    if(story.user != req.user.id) {
        res.redirect('/stories')
    }
    //if the story id matches then replace contents of story with entire body of request
    else {
        story = await Story.findOneAndUpdate({_id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
    }
    } catch(err){
        console.error(err)
        res.render('error/500')
    }
})

// @description     Delete story
// @route Route     DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
})



// @description    User stories
// @route Route    GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user:req.params.userId,
            status: 'public'

        })
            .populate('user')
            .lean() //converts from mongoose to json format for handlebars

        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    } 
})


//export route
module.exports = router

// To use this file we need to bring it into app.js
// by app.use()