# Expense Tracker

A simple expense tracker application built with React, Node.js, and MySQL.

## Features

- User authentication (Login/Register)
- Add, view, and delete expenses
- Income tracking
- Budget management
- Recurring payments support
- Different payment methods

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL

---

## Installation

### 1. Clone the Repository

```sh
https://github.com/Mihik30/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup

#### Install Dependencies

```sh
cd backend
npm install
```

#### Configure Database

Update the `config.js` file with your MySQL credentials:

```js
module.exports = {
    host: 'localhost',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'expense_tracker'
};
```

#### Run Server

```sh
node server.js
```

### 3. Frontend Setup

#### Install Dependencies

```sh
cd frontend
npm install
```

#### Start React App

```sh
npm run dev
```

---

## Database Setup

### Create Database

Run the following SQL command in MySQL:

```sql
CREATE DATABASE expense_tracker;
USE expense_tracker;
```

### Create Tables

```sql
-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loginid VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Expenses Table
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title varchar(20),
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    payment_method_id INT,
    is_recurring BOOLEAN,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Income Table
CREATE TABLE income (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,2) NOT NULL,
    source VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Budgets Table
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category VARCHAR(255) NOT NULL,
    limit_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## API Endpoints

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | /register      | Register a new user         |
| POST   | /login         | Authenticate user           |
| GET    | /expenses      | Get user expenses           |
| POST   | /expenses/add  | Add a new expense           |
| DELETE | /expenses/\:id | Delete an expense           |
| GET    | /income        | Get user income             |
| POST   | /income/add    | Add new income              |
| GET    | /budgets       | Get user budgets            |
| POST   | /budgets/add   | Set a budget for a category |

---

## Future Improvements

- Expense reports & analytics
- Mobile-friendly UI
- Multi-user collaboration

---