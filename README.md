# NestJS Enterprise Boilerplate

Production-ready NestJS boilerplate with authentication, database, WebSocket, and best practices.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with refresh tokens, email verification, password reset
- 👥 **User Management**: Complete user CRUD with role-based access control (RBAC)
- 📁 **File Upload**: Local and S3 storage support with validation
- 📧 **Email Service**: Template-based emails with queue support
- 🔌 **WebSocket**: Real-time communication with Socket.IO
- 🗄️ **Database**: MongoDB with Mongoose ODM
- ⚡ **Caching**: Redis integration for performance
- 📝 **API Documentation**: Auto-generated Swagger/OpenAPI docs
- 🔒 **Security**: Helmet, rate limiting, input validation
- 📊 **Logging**: Winston logger with daily rotation
- 🐳 **Docker**: Development and production Docker setup
- ✅ **Testing**: Unit, integration, and E2E tests
- 🎨 **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## Project Structure

```
├── assets/          # Email templates, static data JSON
├── config/          # Third-party configurations
├── public/          # Static files
├── src/
│   ├── api/         # Business logic modules (auth, users, etc.)
│   ├── common/      # Custom utilities and shared logic
│   ├── event/       # WebSocket gateways
│   ├── lib/         # Built-in modules (database, cache, etc.)
│   ├── schema/      # Database entities
│   ├── seed/        # Database seeds
│   ├── app.module.ts
│   ├── main.ts
│   └── seeder.ts
└── test/            # Test files
```

## Prerequisites

- Node.js >= 20.0.0
- MongoDB >= 6.0
- Redis >= 6
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nestjs-boilerplate
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment file:

```bash
cp .env.example .env
```

4. Update `.env` with your configuration

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker-compose up
```

## API Documentation

Once running, visit: `http://localhost:3000/api/docs`

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests

## Environment Variables

See `.env.example` for all required and optional environment variables.

## License

MIT
