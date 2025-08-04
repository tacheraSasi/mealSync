# 🍽️ MealSync - Office Meal Management System

## Problem Statement
- Manual meal tracking via spreadsheets causes delays and errors
- Employees forget meal submissions without reminders
- Caterers receive inaccurate counts → food waste
- Admins spend hours consolidating orders

## Solution Architecture
**Production-ready microservices system:**
- **API Service** (Node.js/TypeScript) - Business logic & database
- **Notification Service** (Go) - High-performance email/SMS
- **Message Broker** (RabbitMQ) - Asynchronous communication
- **Database** (PostgreSQL) - Data persistence
- **Frontend** (React/TailwindCSS) - Modern responsive UI

## Key Features

### 🗓️ Smart Weekly Planning
- Friday-only meal selection (enforces office workflow)
- Template-based Tanzanian cuisine (18+ authentic dishes)
- Status tracking: Planning → Selection → Confirmation

### 📧 Real-time Notifications
- Welcome emails on registration
- Meal confirmation emails
- RabbitMQ ensures zero message loss
- Supports both email + SMS

### 📊 Excel Export System
- One-click catering reports
- Professional format for external vendors
- Eliminates manual consolidation

### 🌍 Cultural Localization
- 18+ Tanzanian dishes (Ugali na Nyama, Pilau, Wali wa Nazi)
- Organized by category (Main Course, Soup, Salad, etc.)
- Real-world application for Tanzanian offices

## Technical Highlights

### 🏗️ Architecture Excellence
- **Scalable**: Each service scales independently
- **Fault-tolerant**: Services continue if others fail
- **Technology diversity**: Best tool for each job

### 🔐 Security & Best Practices
- JWT authentication with bcrypt password hashing
- TypeORM prevents SQL injection
- Input validation with DTOs
- Timing attack protection

### 🐳 Production Ready
- Full Docker containerization
- Health checks and monitoring
- Environment separation (dev/prod)
- One-command setup: `docker-compose up`

## Impressive Numbers
- **4 Microservices** with full Docker orchestration
- **60+ API Endpoints** with Postman collection
- **2 Programming Languages** (TypeScript + Go)
- **18+ Tanzanian Meals** with cultural relevance
- **Zero Downtime** notifications via message queues

## Demo Flow
1. **Show Architecture** - Docker services running
2. **User Registration** - API → RabbitMQ → Email notification
3. **Meal Selection** - Friday workflow → Confirmation
4. **Admin Export** - Generate Excel report
5. **Monitoring** - RabbitMQ management UI
6. **Database** - Tanzanian meals in PostgreSQL

## Technical Challenges Solved
- **Foreign Key Constraints** - Proper PostgreSQL relationship handling
- **Microservice Communication** - Reliable messaging with RabbitMQ
- **Dev Environment** - Complex multi-service setup simplified

## Business Impact
- **Eliminates manual processes** - No more spreadsheets
- **Reduces food waste** - Accurate counts to caterers  
- **Saves admin time** - Automated reporting
- **Scalable solution** - Grows with business needs

## Future Roadmap
- Mobile app (React Native)
- ML meal recommendations
- Payment integration
- Multi-tenant support

---

**Key Takeaway:** *This isn't just a meal app - it's a showcase of microservice architecture, modern development practices, and real-world problem solving.*
