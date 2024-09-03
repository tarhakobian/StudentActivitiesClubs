const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://admin:admin@studentactivitiesclubs.cqeew.mongodb.net/?retryWrites=true&w=majority&appName=StudentActivitiesClubs")
    .then(r => console.log("Connected to the database"))
    .catch(reason => console.log(`Database connection Failed --- ${reason}`))

module.exports = mongoose

