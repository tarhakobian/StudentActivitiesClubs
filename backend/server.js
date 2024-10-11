const http = require('http')
const app = require('./app')
const mongoose = require('./config/databaseConfig')
const port = process.env.PORT;

const server = http.createServer(app);
server.listen(port);

console.log(`Server listening on port --- ${port}`)

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/** Runs to stop docker container after ^C */
process.on('SIGINT', async () => {
    try {
        console.log('Shutting down server...');

        const { stdout, stderr } = await execPromise('docker compose down');

        if (stderr) {
            console.warn(`${stderr}`);
        }

        console.log('Docker containers stopped.');
        console.log(stdout);

        process.exit();
    } catch (e) {
        console.error("Failed to run 'docker compose down':", e.message);
        process.exit(1);
    }
});

module.exports = { port, server }
