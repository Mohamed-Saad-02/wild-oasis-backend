# The Wild Oasis - Backend API

A comprehensive NestJS backend API for managing a cabin resort booking system. This application handles cabin management, guest bookings, user authentication, and administrative operations.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin/User)
- **Cabin Management**: CRUD operations for cabins with image upload to Cloudinary
- **Booking System**: Complete booking management with status tracking (checked-in, checked-out, unconfirmed)
- **Guest Management**: Guest profile and booking history management
- **Settings**: Application-wide settings configuration
- **User Management**: User registration, login, and role management
- **File Upload**: Image upload support using Cloudinary
- **Data Validation**: Request validation using class-validator
- **Database**: PostgreSQL with TypeORM

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (local or remote)
- **Cloudinary account** (for image uploads)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name

   # Server
   PORT=3000
   NODE_ENV=development

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Database Setup**

   Ensure your PostgreSQL database is running and accessible. The application will automatically synchronize the database schema in development mode.

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

The application will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## 📚 API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Cabins

- `GET /cabins` - Get all cabins (with pagination)
- `GET /cabins/:id` - Get a specific cabin
- `POST /cabins` - Create a new cabin (Admin only, requires image upload)
- `PUT /cabins/:id` - Update a cabin (Admin only)
- `DELETE /cabins/:id` - Delete a cabin (Admin only)
- `DELETE /cabins` - Delete all cabins (Admin only)

### Bookings

- `GET /bookings` - Get all bookings (with pagination, filtering, and sorting)
- `GET /bookings/:id` - Get a specific booking
- `GET /bookings/after-date?date=YYYY-MM-DD` - Get bookings after a specific date
- `GET /bookings/recent-stays?date=YYYY-MM-DD` - Get recent stays
- `GET /bookings/today-activity` - Get today's booking activities
- `POST /bookings` - Create a new booking (Admin only)
- `POST /bookings/bulk` - Create multiple bookings (Admin only)
- `PUT /bookings/:id` - Update a booking (Admin only)
- `DELETE /bookings/:id` - Delete a booking (Admin only)
- `DELETE /bookings` - Delete all bookings (Admin only)

### Guests

- `GET /guests` - Get all guests
- `GET /guests/:id` - Get a specific guest
- `POST /guests` - Create a new guest
- `PUT /guests/:id` - Update a guest
- `DELETE /guests/:id` - Delete a guest

### Settings

- `GET /settings` - Get application settings
- `PUT /settings` - Update application settings

### Users

- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get a specific user
- `POST /users` - Create a new user (Admin only)
- `PUT /users/:id` - Update a user (Admin only)
- `DELETE /users/:id` - Delete a user (Admin only)

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **ADMIN**: Full access to all endpoints
- **USER**: Limited access (varies by endpoint)

## 🗄️ Database Schema

The application uses the following main entities:

- **Users**: User accounts with authentication
- **Cabins**: Cabin/resort room information
- **Guests**: Guest profiles
- **Bookings**: Reservation records linking guests to cabins
- **Settings**: Application configuration

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📝 Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format
```

## 🏗️ Project Structure

```
src/
├── auth/              # Authentication module
├── bookings/          # Booking management
├── cabins/            # Cabin management
├── common/            # Shared utilities, guards, configs
│   ├── config/        # Configuration files
│   ├── constants/     # Application constants
│   ├── guards/        # Authentication/authorization guards
│   ├── services/      # Shared services
│   └── utils/         # Utility functions
├── guests/            # Guest management
├── settings/          # Settings management
├── users/             # User management
├── app.module.ts      # Root module
├── global.module.ts   # Global module
└── main.ts            # Application entry point
```

## 🔧 Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Cloud-based image management
- **class-validator** - Validation decorators
- **class-transformer** - Object transformation
- **Multer** - File upload handling

## ⚙️ Configuration

### CORS

The application is configured to accept requests from `http://localhost:5173` (typical Vite dev server). Update the CORS configuration in `src/main.ts` for production.

### Database Synchronization

In development mode, TypeORM automatically synchronizes the database schema. **This is disabled in production** for safety.

## 📦 Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot-reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## 🚨 Important Notes

- **Never commit `.env` files** - They contain sensitive information
- **Change JWT_SECRET** in production to a strong, random value
- **Disable database synchronization** in production (set `NODE_ENV=production`)
- **Use environment variables** for all configuration values
- **Secure your database** with proper authentication and SSL in production

## 📄 License

This project is private and unlicensed.

## 👥 Contributing

This is a private project. For contributions, please contact the project maintainer.

---

Built with ❤️ using NestJS
