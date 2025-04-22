
# Packaroo Backend

This is the backend for the Packaroo package delivery application. It follows a microservices architecture with clean architecture principles.

## Architecture

The backend is built using:
- Express.js REST APIs
- MongoDB for data storage
- RabbitMQ for message broker
- Docker for containerization
- TypeScript for type safety

The system consists of the following microservices:
- **API Gateway**: Route requests to appropriate services
- **User Service**: Handle user authentication and management
- **Package Service**: Manage packages, tracking, and status
- **Delivery Service**: Handle delivery assignments and status

## Clean Architecture

Each service follows the clean architecture pattern with the following layers:
- **Domain Layer**: Contains business entities and use cases
- **Application Layer**: Contains application logic and services
- **Infrastructure Layer**: Contains implementations of repositories and external services
- **Interface Layer**: Contains controllers, routes, and middleware

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 16+ (for development)

### Running the Backend

1. From the `backend` directory, run:
```
docker-compose up
```

This will start all services, MongoDB, and RabbitMQ.

2. The API Gateway will be available at http://localhost:8080

### Development

To run individual services in development mode:

1. Navigate to a service directory:
```
cd services/user-service
```

2. Install dependencies:
```
npm install
```

3. Run in development mode:
```
npm run dev
```

## API Documentation

### User Service (via API Gateway)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Package Service (via API Gateway)
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create a new package
- `PUT /api/packages/:id` - Update a package
- `GET /api/track/:id` - Track a package (public)

### Delivery Service (via API Gateway)
- `GET /api/deliveries/driver` - Get deliveries for driver
- `GET /api/deliveries/owner` - Get deliveries for package owner
- `POST /api/deliveries/:id/start` - Start a delivery
- `POST /api/deliveries/:id/complete` - Complete a delivery
- `POST /api/deliveries/:id/issue` - Report an issue with delivery
