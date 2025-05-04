<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">RicFlow - Backend CMS</h1>

<p align="center">Flexible and scalable CMS backend built with NestJS.</p>

---

## 🚀 About the Project

RicFlow is a flexible and open-source CMS designed to be easily adapted to various projects. This is the backend application of RicFlow, built with NestJS and focused on providing a robust structure for content management. With a modular and scalable architecture, RicFlow Backend allows developers to customize, extend, and integrate features according to project needs.

---

## 📦 Technologies Used

- [NestJS](https://nestjs.com/)
- TypeScript
- Node.js
- PostgreSQL (or another SQL database via TypeORM)
- TypeORM
- dotenv
- Swagger for API documentation

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/germanoricardi/ricflow-backend
cd ricflow-backend
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🛠️ Environment Configuration

Before running the application, you can rename the `.env-example` file to `.env` and adjust the variables according to your environment.

---

## ▶️ Running the Application

```bash
# Run in development mode
npm run start:dev

# Run in production mode
npm run start:prod

# Run in watch mode (auto-restart)
npm run start:watch
```

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 🧾 API Documentation

If Swagger is enabled in the project, you can access the API documentation at:

```
http://localhost:3000/api
```

---

## 🚀 Deployment

To deploy the project:

1. Make sure your environment variables are set correctly on the production server.
2. Build the project:

```bash
npm run build
```

3. Start the app in production mode:

```bash
npm run start:prod
```

You can also use process managers like **PM2** or **Docker** to manage your deployment.

---

## 📂 Project Structure

```
src/
├── auth/
├── common/
├── config/
├── database/
├── modules/
├── main.ts
```

---

## 👨‍💻 Author

Made with ❤️ by [Germano Morel Ricardi](https://github.com/germanoricardi)

---

## 📄 License

This project is licensed under GPL-3.0.
