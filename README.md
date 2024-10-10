
# StudentActivitiesClubs Backend

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone <repository-url>
cd StudentActivitiesClubs
```

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
npm install
```

This will download all necessary packages for the project.

### 3. Ensure Docker is Installed

Make sure you have Docker installed on your machine. You can verify if Docker is installed by running:

```bash
docker --version
```

If Docker is not installed, you can download and install it from the official [Docker website](https://www.docker.com/products/docker-desktop).

### 4. Start MongoDB with Docker Compose

Navigate to the backend directory:

```bash
cd backend
```

Run the following command to start MongoDB using Docker Compose:

```bash
docker-compose up -d
```

This command will spin up a MongoDB container in detached mode (`-d`), running in the background.

### 5. Stopping the Server

When you need to stop the server, make sure to properly shut down the MongoDB container by running:

```bash
docker-compose down
```

This will stop and remove the MongoDB container.

### 6. Migrate Data to MongoDB

Once the MongoDB container is running, migrate the necessary data by running:

```bash
npm run mig
```

This command will migrate data to your MongoDB instance.

### 7. Run the server

```bash
npm run start
```

### 8. Access API Documentation

Once the server is up and running, you can access the API documentation by navigating to:

```
http://localhost:8080/api-docs
```

This will open a Swagger UI where you can explore the available API endpoints.

---

## Additional Notes

- Ensure that Docker is up and running before starting the server.
- Always remember to shut down your MongoDB container when you're done by running `docker-compose down`.
- Refer to the API documentation at `http://localhost:8080/api-docs` for detailed information on the available endpoints.
