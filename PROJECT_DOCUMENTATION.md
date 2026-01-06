# Yavij Express Project Documentation

## 1. Project Overview
Yavij Express is a full-stack web application designed for logistics and delivery services. It consists of a Spring Boot backend and a React frontend.

## 2. Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Build Tool:** Maven
- **Database:** PostgreSQL (with Flyway for migration)
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **API Documentation:** SpringDoc OpenAPI (Swagger)
- **Payment Gateway:** Razorpay
- **Other Libraries:**
  - Lombok (Boilerplate code reduction)
  - ModelMapper (Object mapping)
  - Spring Boot Starter Mail (Email services)
  - Spring Boot Starter WebSocket (Real-time communication)

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** JavaScript (JSX)
- **Routing:** React Router DOM
- **UI Libraries:**
  - Material UI (@mui/material, @mui/icons-material)
  - Framer Motion (Animations)
  - React Icons
- **HTTP Client:** Axios

## 3. Project Structure

### Backend Structure (`yavijexpress/yavijexpress`)
The backend follows a standard layered architecture:
- **`config`**: Configuration classes (Security, Swagger, etc.)
- **`controller`**: REST API endpoints
- **`dto`**: Data Transfer Objects for API requests/responses
- **`entity`**: JPA Entities representing database tables
- **`exception`**: Global exception handling
- **`repository`**: Data access layer (Spring Data JPA)
- **`security`**: Authentication and authorization logic
- **`service`**: Business logic implementation
- **`utils`**: Utility classes

### Frontend Structure (`yavijexpress-frontend`)
The frontend is organized as follows:
- **`src/api`**: API integration logic
- **`src/components`**: Reusable UI components
- **`src/context`**: React Context for state management
- **`src/pages`**: Application pages/views
- **`src/app`**: App-specific logic
- **`src/App.jsx`**: Main application component
- **`src/main.jsx`**: Entry point

## 4. Key Features
- **User Authentication:** Secure login and registration using JWT.
- **Role-Based Access Control:** Managed via Spring Security.
- **Order Management:** Functionality to handle delivery orders.
- **Payment Integration:** Razorpay integration for processing payments.
- **Real-time Updates:** WebSocket support for live notifications/updates.
- **Responsive UI:** Built with Material UI for a consistent experience across devices.

## 5. Setup Instructions

### Backend Setup
1. Navigate to `yavijexpress/yavijexpress`.
2. Ensure Java 17 and Maven are installed.
3. Configure the database connection in `application.properties` or `application.yml`.
4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to `yavijexpress-frontend`.
2. Ensure Node.js is installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 6. API Documentation
Once the backend is running, API documentation is available via Swagger UI (typically at `http://localhost:8080/swagger-ui.html`).
