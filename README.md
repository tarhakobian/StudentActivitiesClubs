# Backend Setup and Start Instructions

Make sure you have Node.js installed on your machine.

## Setup

1. **Navigate to backend directory from the terminal:**

    ```bash
    cd ./backend
    ```

2. **Initialize your project:**

    ```bash
    npm init -y
    ```

3. **Install required dependencies:**

    ```bash
    npm install express
    npm install mongodb
    npm install mongoose
    npm install nodemon
    ```

4. **Run the backend:**

   Make sure your `package.json` looks like this.

    ```json
    {
   "name": "backend",
   "version": "1.0.0",
   "main": "index.js",
   "scripts": {
   "test": "echo \"Error: no test specified\" && exit 1",
   "start": "nodemon server.js",
   "mig" : "node ./database/migrate.js"
   },
   "keywords": [],
   "author": "",
   "license": "ISC",
   "description": "",
   "dependencies": {
   "express": "^4.19.2",
   "mongodb": "^6.8.0",
   "mongoose": "^8.6.0",
   "nodemon": "^3.1.4"
   }```

Then you can start your server with:

```bash
npm start
```

**Stopping the server:**

To stop the server that is running in your terminal, press `Ctrl + C`. This will terminate the server process.



