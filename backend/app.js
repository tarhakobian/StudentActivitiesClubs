const express = require('express')

const clubRoutes = require("./api/route/clubsRoute")
const userRoutes = require('./api/route/usersRoute')

const app = express()
app.use(express.json());

app.use('/clubs', clubRoutes)
app.use('/users', userRoutes)

module.exports = app;

