CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    status VARCHAR(50)
);

INSERT INTO users (name, age, status) VALUES ('Alice', 30, 'active');
INSERT INTO users (name, age, status) VALUES ('Bob', 25, 'inactive');
INSERT INTO users (name, age, status) VALUES ('Charlie', 35, 'active');
INSERT INTO users (name, age, status) VALUES ('David', 28, 'pending');
