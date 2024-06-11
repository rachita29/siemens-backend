school-exam-backend
====================
## Database Design (ERD)
1. User Collection
Fields: name, email, password, role

2. Class Collection
Fields: name, subject, teacher

3. Question Collection
Fields: classId, text, options

## High-Level Design

1. Project is build using Node.js with Express, Mongoose for MongoDB integration.
2. Database: MongoDB to store user, class, and question data.
3. Authentication: JWT for secure API access.
4. File Handling: Multer for handling file uploads.
5. PDF Generation: pdfkit for generating PDF documents.

## API Documentation
1. POST /api/auth/register: Register a new user.
2. POST /api/auth/login: Login and receive a JWT token.
3. POST /api/teachers/classes: Create a new class.
4. POST /api/teachers/upload/: Upload a question bank.
5. GET /api/students/take-exam/: Simulate taking an exam.
6. POST /api/students/generate-pdf: Generate a PDF for exam results.

## Setup Instructions
1. Backend Setup

* Navigate to the backend directory.
* Install dependencies: npm install
* Start the server: node app.js

2. MongoDB Setup
* Install MongoDB and start the service.