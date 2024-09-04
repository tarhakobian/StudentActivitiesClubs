const http = require('http')
const app = require('./app')
const mongoose = require('./config/databaseConfig')
const port = process.env.PORT;

const server = http.createServer(app);
server.listen(port);

console.log(`Server listening on port --- ${port}`)

module.exports = {port, server}
