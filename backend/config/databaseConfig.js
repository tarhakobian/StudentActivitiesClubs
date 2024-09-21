require('dotenv').config();
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL)
    .then(r => console.log("Connected to the database"))
    .catch(reason => {
        console.log(`Database connection Failed --- ${reason}`)
        process.exit(0);
    })

module.exports = mongoose

