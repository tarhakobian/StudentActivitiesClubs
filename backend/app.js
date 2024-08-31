const express = require('express');

const clubRoutes = require("./api/routes/clubs");

const app = express();

app.use('/clubs', clubRoutes);

module.exports = app;

