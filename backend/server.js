const http = require('http')
const app = require('./app')
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;

const server = http.createServer(app);

mongoose.connect("mongodb+srv://admin:admin@studentactivitiesclubs.cqeew.mongodb.net/?retryWrites=true&w=majority&appName=StudentActivitiesClubs")
    .then(r => console.log("Connected to the database"))
    .then(r => server.listen(port))
    .then(r => console.log(`Server listening on port ${port}`))
    .catch(reason => console.log(`Connection Failed --- ${reason}`))


