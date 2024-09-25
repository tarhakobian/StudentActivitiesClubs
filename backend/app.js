const express = require('express');

const clubRoutes = require('./api/route/clubsRoute');
const userRoutes = require('./api/route/usersRoute');
const meetingRoutes = require('./api/route/meetingRoutes');
const announcementRoutes = require('./api/route/announcementRoutes');
const { errorMiddlewear } = require('./api/middlewear/errorMiddlewear');

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/clubs', clubRoutes);
app.use('/clubs/announcements', announcementRoutes);
app.use('/clubs/meetings', meetingRoutes);


app.use(errorMiddlewear)

module.exports = app;
