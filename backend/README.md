# MealSync Backend - Microservice Architecture

This backend consists of two main services:
1. **API Service** (Node.js/Express/TypeScript) - Main application server
2. **Notification Service** (Go) - Handles email and SMS notifications

## Services Overview

### API Service (Port 3001)
- Handles all HTTP requests (user management, menu operations, lunch choices)
- Manages PostgreSQL database with TypeORM
- Publishes notification requests to RabbitMQ

### Notification Service (Background)
- Consumes notification requests from RabbitMQ
- Sends emails via SMTP
- Sends SMS via external API (notify-africa-go)

### Infrastructure Services
- **PostgreSQL** (Port 5432) - Main database
- **RabbitMQ** (Port 5672, Management UI: 15672) - Message broker

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Copy `.env.example` to `.env` and configure your environment variables

### Development Mode
```bash
# Start all services in development mode
docker-compose -f docker-compose.dev.yml up --build

# Start specific services
docker-compose -f docker-compose.dev.yml up postgres rabbitmq
docker-compose -f docker-compose.dev.yml up api notification-service
```

### Production Mode
```bash
# Start all services in production mode
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs api
docker-compose logs notification-service
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=mealsync_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@mealsync.com

# SMS Configuration (optional)
SMS_APIKEY=your_sms_api_key
EMAIL_APIKEY=your_email_api_key

# RabbitMQ (usually defaults are fine)
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
```

## Service Communication

The API service communicates with the Notification service via RabbitMQ:

1. **User Registration**: Automatically sends welcome email
2. **Meal Selection**: Sends confirmation email with meal details
3. **Future**: Can be extended for reminders, weekly summaries, etc.

### Message Flow
```
API Service → RabbitMQ (email_queue) → Notification Service → SMTP/SMS
```

## Monitoring and Management

### RabbitMQ Management UI
- URL: http://localhost:15672
- Username: guest
- Password: guest

### Health Checks
- API Health: http://localhost:3001/health
- Database: Automatic health checks in Docker Compose
- RabbitMQ: Automatic health checks in Docker Compose

## Development

### Running Locally (without Docker)

1. **Start Infrastructure**:
   ```bash
   docker-compose -f docker-compose.dev.yml up postgres rabbitmq
   ```

2. **Start API Service**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Start Notification Service**:
   ```bash
   cd notification-service
   go mod download
   go run main.go
   ```

### API Endpoints
- `GET /health` - Health check
- `POST /user/register` - Register user (triggers welcome email)
- `POST /lunchChoice` - Make meal selection (triggers confirmation email)
- All other endpoints as documented in the API collection

## Troubleshooting

### Common Issues

1. **RabbitMQ Connection Failed**:
   - Check if RabbitMQ container is running
   - Verify RABBITMQ_URL environment variable
   - Check Docker network connectivity

2. **Email Not Sending**:
   - Verify SMTP credentials in environment variables
   - Check notification service logs: `docker-compose logs notification-service`
   - Ensure email queue is receiving messages in RabbitMQ UI

3. **Database Connection Failed**:
   - Check PostgreSQL container status
   - Verify database credentials
   - Check if database initialization completed

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs api
docker-compose logs notification-service
docker-compose logs postgres
docker-compose logs rabbitmq

# Follow logs in real-time
docker-compose logs -f api
```

## Scaling

This architecture supports horizontal scaling:

- **API Service**: Can run multiple instances behind a load balancer
- **Notification Service**: Can run multiple instances (RabbitMQ will distribute messages)
- **Database**: Can be configured with read replicas
- **RabbitMQ**: Can be configured in cluster mode

## Security Notes

1. Change default RabbitMQ credentials in production
2. Use strong JWT secrets
3. Configure SMTP with app passwords, not plain passwords
4. Use environment-specific `.env` files
5. Enable SSL/TLS in production
