-- Create database
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subjects table (updated with start_date)
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    start_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Assignments table
CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'submitted') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email, password) VALUES 
('John Doe', 'john@example.com', '$2b$10$rQZ9QmjlhQZ9QmjlhQZ9Qu'),
('Jane Smith', 'jane@example.com', '$2b$10$rQZ9QmjlhQZ9QmjlhQZ9Qu');

INSERT INTO subjects (user_id, name, description, color, start_date) VALUES 
(1, 'Mathematics', 'Advanced calculus and algebra', '#EF4444', '2024-01-15'),
(1, 'Computer Science', 'Programming and algorithms', '#3B82F6', '2024-01-20'),
(1, 'Physics', 'Quantum mechanics and thermodynamics', '#10B981', '2024-02-01');

INSERT INTO assignments (user_id, subject_id, title, description, deadline, priority, status) VALUES 
(1, 1, 'Calculus Problem Set', 'Complete problems 1-20', '2024-02-15', 'high', 'pending'),
(1, 2, 'Algorithm Implementation', 'Implement sorting algorithms', '2024-02-20', 'medium', 'in_progress'),
(1, 3, 'Lab Report', 'Write quantum mechanics lab report', '2024-02-10', 'high', 'submitted');
