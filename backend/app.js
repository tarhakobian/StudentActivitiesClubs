const express = require('express');
const cors = require('cors');

const clubRoutes = require('./api/route/clubsRoute');
const userRoutes = require('./api/route/usersRoute');
const meetingRoutes = require('./api/route/meetingRoutes');
const announcementRoutes = require('./api/route/announcementRoutes');
const uploadRoute = require('./api/route/uploadRoute');
const notificationRoutes = require('./api/route/notificationRoutes');
const openaiRoutes = require('./api/route/openAiRoutes')
const swaggerSpec = require('./config/swaggerConfig');
const swaggerUi = require('swagger-ui-express');
const { errorMiddlewear } = require('./api/middlewear/errorMiddlewear');


const app = express();

app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/clubs', clubRoutes);
app.use('/club/announcements', announcementRoutes);
app.use('/club/meetings', meetingRoutes);
app.use('/notifications', notificationRoutes);
app.use('/upload', uploadRoute);
app.use('/openai', openaiRoutes)

// TODO : add authenticate middlewear
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use(errorMiddlewear)

module.exports = app;
