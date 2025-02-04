CREATE DATABASE expense_tracker;

USE expense_tracker;

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL
);

select * from expenses;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loginid VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

ALTER TABLE expenses ADD COLUMN user_id INT;
ALTER TABLE expenses ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

select * from expenses;
select * from users;
alter table expenses drop column user_id ;
ALTER TABLE expenses ADD COLUMN category ENUM('Food', 'Housing', 'Transportation', 'Entertainment', 'Miscellaneous') NOT NULL;
select * from expenses;
describe expenses;


