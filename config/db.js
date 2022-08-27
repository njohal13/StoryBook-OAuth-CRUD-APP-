const mongoose = require('mongoose')


//Mongoose works with promises so we'll use an async function which has try catch blocks to catch errors
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)

    }
    catch (err) {
        console.error(err)
        process.exit(1)
    }
}

// export the connectDB function from here and require it in app
module.exports = connectDB