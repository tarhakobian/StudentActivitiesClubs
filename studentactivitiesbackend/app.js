const express = require('express');

const app = express();
const clubRoutes = require("./api/routes/clubs");

app.use('/clubs',clubRoutes);

module.exports = app;

