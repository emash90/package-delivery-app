# Packaroo - Microservices-Based Package Tracking System

![Packaroo Screenshot](https://via.placeholder.com/800x400.png?text=Packaroo+Application+UI)

Packaroo is a full-stack package delivery and tracking application built with a modern microservices architecture. It provides a platform for package owners, delivery drivers, and administrators to manage the entire lifecycle of a package, from creation to final delivery, with real-time status updates.

## ✨ Features

- **Role-Based Access Control**: Separate dashboards and functionalities for Package Owners, Drivers, and Administrators.
- **Real-Time Package Tracking**: Users can track their packages using a unique tracking ID.
- **Package Management**: Owners can create, update, and manage their packages.
- **Delivery Management**: Drivers can view pending deliveries, accept jobs, and update delivery statuses in real-time.
- **Admin Oversight**: Administrators have a comprehensive view of the entire system to manage users and operations.
- **Event-Driven Architecture**: Microservices communicate asynchronously using RabbitMQ for a resilient and scalable system.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Redux Toolkit, React Query
- **Backend**: Node.js, Express.js, TypeScript
- **Architecture**: Microservices (API Gateway, User Service, Package Service, Delivery Service)
- **Database**: MongoDB
- **Message Broker**: RabbitMQ
- **Containerization**: Docker & Docker Compose

## 📂 Project Structure

The project is organized as a monorepo with a clear separation between the frontend and backend services.

```
/
├── backend/
│   ├── api-gateway/      # Handles incoming requests and routes them to the appropriate service.
│   └── services/
│       ├── user-service/     # Manages user authentication and profiles.
│       ├── package-service/  # Manages package creation and data.
│       └── delivery-service/ # Manages delivery logistics and status updates.
├── client/               # React frontend application.
├── docker-compose.yml    # Orchestrates all services for local development.
└── .env.example          # Environment variable template.
```

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following software installed on your system:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/package-project.git
    cd package-project
    ```

2.  **Create the environment file:**
    Duplicate the `.env.example` file and rename it to `.env`. This file will hold all your environment variables and secrets.

    ```bash
    cp .env.example .env
    ```

    You can use the default values in the newly created `.env` file for a standard local setup.

    ```dotenv
    # RabbitMQ Credentials
    RABBITMQ_DEFAULT_USER=guest
    RABBITMQ_DEFAULT_PASS=guest

    # MongoDB Connection & Credentials
    MONGO_INITDB_ROOT_USERNAME=packaroo_user
    MONGO_INITDB_ROOT_PASSWORD=supersecretpassword
    MONGODB_URI=mongodb://packaroo_user:supersecretpassword@mongo:27017/packaroo-testdb?authSource=admin

    # Application Secrets
    JWT_SECRET=a_much_stronger_and_longer_secret_key_than_kim2016

    # Service Ports
    USER_SERVICE_PORT=5001
    PACKAGE_SERVICE_PORT=5002
    DELIVERY_SERVICE_PORT=5003
    API_GATEWAY_PORT=4000
    FRONTEND_PORT=9000
    RABBITMQ_PORT=5672
    RABBITMQ_MANAGEMENT_PORT=15672
    MONGO_PORT=27017
    ```

3.  **Build and run the services:**
    Use Docker Compose to build the images and start all the containers in detached mode.

    ```bash
    docker-compose up --build -d
    ```

    The `--build` flag ensures that Docker images are rebuilt if there are any changes. You can omit it for subsequent runs. The `-d` flag runs the containers in the background.

## 🖥️ Usage

Once the containers are running, you can access the different parts of the application:

- **Frontend Application**: http://localhost:9000
- **API Gateway**: http://localhost:4000
- **RabbitMQ Management UI**: http://localhost:15672
  -   _Login with `guest` / `guest`._
- **MongoDB**: Connect using a client like MongoDB Compass at `mongodb://localhost:27017`.

To stop all the running services, use:
```bash
docker-compose down
```

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.