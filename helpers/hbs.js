//Handlebar helpers
// in app.js under handlebars engine -> helpers -> add each one
// in stories/index add each one 

// Moment is a helper that will format the Date
const moment = require('moment')

module.exports = {
    // format date
    formatDate: function(date, format){
        return moment(date).format(format)
    },
    //Specify visible length of story in card
    truncate: function (str, len){
        if(str.length > len && str.length > 0) {
            let new_str = str + ' ' 
            new_str = str.substr(0, len) 
            new_str = str.substr(0, new_str.lastIndexOf(' ')) 
            new_str = new_str.length > 0 ? new_str : str.substr(0, len) 
            return new_str + '...' 
        } 
        return str  
    },
    // Replace html format tags (bold, italics, etc..) from the inputted story with '' nothing
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },

    editIcon: function (storyUser, loggedUser, storyId, floating = true) { 
        if (storyUser._id.toString() == loggedUser._id.toString()) { 
            if (floating) { 
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>` 
            } else { 
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>` 
            } 
        } else { 
            return '' 
        } 
    },

    //Added after edit.hbs.  Replaces the default selected thing with nothing, grab value for what was selected and replace it
    select: function (selected, options) { 
        return options 
        .fn(this) 
        .replace( 
            new RegExp(' value="' + selected + '"'), 
            '$& selected="selected"' 
        ) 
        .replace( 
            new RegExp('>' + selected + '</option>'), 
            ' selected="selected"$&' 
        ) 
    },
}