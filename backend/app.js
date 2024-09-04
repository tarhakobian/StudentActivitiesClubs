const express = require('express')

const clubRoutes = require("./api/route/clubs")
const userRoutes = require('./api/route/users')

const app = express()

app.use('/clubs', clubRoutes)
app.use('/users', userRoutes)

module.exports = app;

