//SERVER

//Setup express server framework. Express has routing concepts built in that help us route to dif links
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars') // template engine - handlebars
const methodOverride = require('method-override')
const path = require('path') // for use in static folder
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')


//Import function that connects to database from ./config/db folder
const connectDB = require('./config/db')
const { ppid } = require('process')


//Load config file path to .env files
dotenv.config({ path: './config/config.env'})

//Passport config
require('./config/passport')(passport)


// call function that connects to mongodb
connectDB()


//Initialize express server as app
const app = express()


//Body Parser middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//Method Override
app.use(methodOverride(function (req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body){
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//Logging - When in development mode use morgan to log which pages are being touched
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


//Handlebar helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')


//Handlebars - Templating Engine
//!Add the word engine after exphbs
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,

    },
    extname: '.hbs',
    defaultLayout: 'main'
    })
)


//Session middleware (goes before Passport middleware)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //add MongoStore
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
    
  }))


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})


//Set our view engine to be handlebars .hbs. Looks for the views folder, with files ending in .hbs
//Dont have to put the full file path in when we render the file
app.set('view engine', '.hbs')



//Static Folder - Allows access to static files like styles.css
app.use(express.static(path.join(__dirname, 'public')))



//Routes
//Specify what app.js should do when it gets these requests.
// It should use (find) the get '/' homepage route, which we created in index.js
app.use('/', require('./routes/index'))
app.use('/dashboard', require('./routes/index'))

app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT || 5500



//Setup server so it runs on the port
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`))