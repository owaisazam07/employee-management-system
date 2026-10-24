# Employee Management System

Full-stack CRUD application:
- Frontend: Angular, TypeScript, HTML, CSS, Bootstrap
- Backend: Java 21, Spring Boot 3.5, Spring Data JPA, Hibernate, REST API
- Database: MySQL (`employee_management`)

## Requirements
- JDK 21
- Maven 3.9+ (or use IntelliJ's bundled Maven)
- Node.js 20.19+ or 22.12+
- Angular CLI is not required globally; npm scripts use the local CLI
- MySQL 8+

## 1. Create database
Run in MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS employee_management;
```

## 2. Configure backend
Edit `backend/src/main/resources/application.properties` and set your MySQL username/password.
Default username is `root`; replace `CHANGE_ME` with your local password. Never commit real credentials.

## 3. Run backend
From the `backend` folder:
```bash
mvn spring-boot:run
```
API base URL: `http://localhost:8080/api/employees`

## 4. Run frontend
From the `frontend` folder:
```bash
npm install
npm start
```
Open `http://localhost:4200`.

## Features
- List employees
- Add employee
- Edit employee
- Delete employee
- Search by name, email, or department
- Form validation and success/error messages

## API endpoints
- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `DELETE /api/employees/{id}`

## Backend layers
- `controller`: REST endpoints
- `dto`: `EmployeeRequest` validates incoming data; `EmployeeResponse` defines the response shape
- `entity`: JPA entity mapped to MySQL
- `repository`: Spring Data JPA persistence
- `service`: business logic and DTO/entity mapping
- `exception`: API error handling

Hibernate creates/updates the `employees` table automatically with `ddl-auto=update`.
"# employee-management-system" 
