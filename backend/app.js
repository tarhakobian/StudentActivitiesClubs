const express = require('express');

const clubRoutes = require('./api/route/clubsRoute');
const userRoutes = require('./api/route/usersRoute');
const meetingRoutes = require('./api/route/meetingRoutes');
const announcementRoutes = require('./api/route/announcementRoutes');
const swaggerSpec = require('./config/swaggerConfig');
const swaggerUi = require('swagger-ui-express');
const { errorMiddlewear } = require('./api/middlewear/errorMiddlewear');

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/clubs', clubRoutes);
app.use('/club/announcements', announcementRoutes);
app.use('/club/meetings', meetingRoutes);

// TODO : add authenticate middlewear
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use(errorMiddlewear)

module.exports = app;
