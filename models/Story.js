//Schema - the outline for the data we input will be stored in mongodb

const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,   //Connect each user to a unique id
        ref: 'User',
        //!Change: This field should be required cause the app will break if the user is not present
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Story', StorySchema)


//Next add the model to index.js
//Add functionality under dashboard in index.js