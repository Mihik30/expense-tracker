# Expense Tracker

A simple expense tracker application built using React for the frontend and Node.js with MySQL for the backend. This application allows users to register, log in, add, delete, and view expenses linked to their accounts.

## Features
- User registration and login
- User-specific expense tracking
- Add, delete, and view expenses
- Persistent authentication using local storage

## Technologies Used
- **Frontend**: React, Axios
- **Backend**: Node.js, Express, MySQL
- **Database**: MySQL

---

## Setup Instructions

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```sh
git clone https://github.com/Mihik30/expense-tracker.git
cd expense-tracker
```

### 2. Set Up the Backend
#### Navigate to the backend directory:
```sh
cd backend
```

#### Install dependencies:
```sh
npm install
```

#### Create a `.env` file in the backend directory and configure the following:
```
DB_HOST=localhost
DB_USER=root  # Change this if you have a different username
DB_PASSWORD=your_password  # Change this to your MySQL password
DB_NAME=expense_tracker  # Name of your database
```

#### Start the MySQL Server and Create the Database
Login to MySQL and create the database:
```sh
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE expense_tracker;
USE expense_tracker;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loginid VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Start the Backend Server
```sh
node server.js
```
Server should now be running on `http://localhost:5000`

---

### 3. Set Up the Frontend
#### Navigate to the frontend directory:
```sh
cd ../frontend
```

#### Install dependencies:
```sh
npm install
```

#### Start the React App
```sh
npm start
```
React app should now be running on `http://localhost:3000`
