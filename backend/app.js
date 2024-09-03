const express = require('express');

const clubRoutes = require("./api/route/clubs");

const app = express();

app.use('/clubs', clubRoutes);

module.exports = app;

