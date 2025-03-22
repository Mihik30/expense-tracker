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

delete from users where loginid = 'mihik' and loginid = 'sahh';

select * from users;

SELECT * FROM expenses WHERE userId = '3';
ALTER TABLE expenses ADD COLUMN user_id INT NOT NULL;
ALTER TABLE expenses ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

select * from expenses;

UPDATE expenses SET user_id = 3 WHERE user_id IS NULL;

ALTER TABLE expenses MODIFY COLUMN user_id INT NOT NULL;
UPDATE expenses SET user_id = 1 WHERE user_id IS NULL; -- Assign all to test user
DESC expenses;


select * from expenses;
select * from users;

ALTER TABLE expenses
ADD COLUMN payment_method_id INT,
ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE;

CREATE TABLE income (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    limit_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
select * from income;
SELECT * FROM expenses WHERE user_id = 6;
DESC expenses;

ALTER TABLE expenses 
MODIFY COLUMN payment_method_id ENUM('Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other') NOT NULL;

ALTER TABLE expenses 
MODIFY COLUMN is_recurring ENUM('Yes', 'No') NOT NULL;

UPDATE expenses 
SET payment_method_id = 'Other'
WHERE payment_method_id NOT IN ('Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other');

UPDATE expenses SET payment_method_id = 'Other' WHERE payment_method_id IS NULL;

ALTER TABLE expenses MODIFY COLUMN payment_method_id VARCHAR(20);

SELECT DISTINCT payment_method_id FROM expenses;
UPDATE expenses 
SET payment_method_id = 
    CASE 
        WHEN payment_method_id = '1' THEN 'Cash'
        WHEN payment_method_id = '2' THEN 'Credit Card'
        WHEN payment_method_id = '3' THEN 'Debit Card'
        WHEN payment_method_id = '4' THEN 'UPI'
        ELSE 'Other'
    END;

SET SQL_SAFE_UPDATES = 0;

ALTER TABLE expenses  
MODIFY COLUMN payment_method_id ENUM('Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other') NOT NULL;

SELECT * FROM budgets WHERE user_id = 6;

INSERT INTO budgets (user_id, category, limit_amount) VALUES (6, 'Food', 500);
SELECT payment_method_id, is_recurring FROM expenses;

UPDATE expenses
SET payment_method_id = 
    CASE 
        WHEN payment_method_id = '1' THEN 'Cash'
        WHEN payment_method_id = '2' THEN 'Credit Card'
        WHEN payment_method_id = '3' THEN 'Debit Card'
        WHEN payment_method_id = '4' THEN 'UPI'
        ELSE 'Other'
    END;
    
    UPDATE expenses
SET is_recurring = 'No'
WHERE is_recurring IS NULL OR is_recurring NOT IN ('Yes', 'No');



