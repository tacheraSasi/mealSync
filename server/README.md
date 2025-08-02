# MealSync Server

A Node.js/Express TypeScript server for office lunch menu management.

## 🚀 Features

- **User Management**: Registration, login, and user profiles
- **Menu Management**: Create, update, and manage daily lunch menus
- **Lunch Choice Tracking**: Users can select their lunch preferences
- **TypeORM Integration**: PostgreSQL database with automatic migrations
- **Validation**: Input validation using class-validator and DTOs
- **Security**: Password hashing with bcrypt and timing attack protection

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Validation**: class-validator
- **Authentication**: bcryptjs
- **Development**: nodemon, ts-node

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## 🔧 Setup

### 1. Clone and Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/mealsync_db

# For local PostgreSQL with Docker
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_DATABASE=mealsync_db
DB_PORT=5432
```

### 3. Database Setup

#### Option A: Using Docker (Recommended for development)

```bash
# Start PostgreSQL container
docker-compose up -d
```

#### Option B: Local PostgreSQL

Ensure PostgreSQL is running and create a database:

```sql
CREATE DATABASE mealsync_db;
```

#### Option C: Cloud Database (Neon, etc.)

Update `DATABASE_URL` in `.env` with your cloud database connection string.

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will be available at `http://localhost:5000`

## 📚 API Endpoints

### User Management
- `POST /user/register` - Register a new user
- `POST /user/login` - User login
- `GET /user/` - Get all users
- `GET /user/:id` - Get user by ID

### Menu Management
- `POST /menu/add` - Create a new menu
- `GET /menu/` - Get all menus
- `PUT /menu/:id` - Update a menu

### Lunch Choice Management
- `POST /lunchChoice/add` - Add a lunch choice
- `GET /lunchChoice/` - Get all lunch choices
- `DELETE /lunchChoice/:id` - Delete a lunch choice

## 🗂️ Project Structure

```
server/
├── src/
│   ├── entities/          # TypeORM entities (User, Menu, LunchChoice)
│   ├── services/          # Business logic layer
│   ├── routes/            # API route handlers and controllers
│   ├── dto/               # Data transfer objects for validation
│   ├── middleware/        # Custom middleware (validation)
│   ├── utils/            # Database configuration
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── docker-compose.yml    # PostgreSQL container setup
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🔐 Security Features

- Password hashing with bcrypt (10 salt rounds)
- Timing attack protection in login function
- Input sanitization and validation
- Type-safe development with TypeScript
- SQL injection protection via TypeORM

## 🚦 Development

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests (when implemented)
npm test
```

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `DB_USERNAME` | Docker PostgreSQL username | postgres | For Docker |
| `DB_PASSWORD` | Docker PostgreSQL password | - | For Docker |
| `DB_DATABASE` | Docker PostgreSQL database name | mealsync_db | For Docker |
| `DB_PORT` | Docker PostgreSQL port | 5432 | For Docker |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
