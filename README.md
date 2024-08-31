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
    ```

4. **Run the backend:**

   Add a `start` script to your `package.json` to start the server.

    ```json
    "scripts": {
        "start": "node server.js"
    }
    ```

   Then you can start your server with:

    ```bash
    npm start
    ```

   **Stopping the server:**

   To stop the server that is running in your terminal, press `Ctrl + C`. This will terminate the server process.



