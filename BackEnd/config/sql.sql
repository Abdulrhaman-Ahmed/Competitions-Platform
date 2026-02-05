-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student', 'judge') DEFAULT 'student',
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);

-- Competitions Table
CREATE TABLE competitions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('upcoming', 'ongoing', 'completed', 'closed') DEFAULT 'upcoming',
  max_participants INT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Participants Table
CREATE TABLE participants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  competition_id INT NOT NULL,
  user_id INT NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected', 'participated') DEFAULT 'pending',
  submission_file VARCHAR(255),
  submission_date DATETIME NULL,
  notes TEXT,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_participation (competition_id, user_id)
);

-- Judges Table
CREATE TABLE judges (
  id INT PRIMARY KEY AUTO_INCREMENT,
  competition_id INT NOT NULL,
  user_id INT NOT NULL,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_judge_assignment (competition_id, user_id)
);

-- Scores Table
CREATE TABLE scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  participant_id INT NOT NULL,
  judge_id INT NOT NULL,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE CASCADE,
  UNIQUE KEY unique_judge_score (participant_id, judge_id)
);

-- Certificates Table
CREATE TABLE certificates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  participant_id INT NOT NULL,
  certificate_code VARCHAR(50) UNIQUE NOT NULL,
  final_score DECIMAL(5,2),
  rank_position INT,
  issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  certificate_url VARCHAR(255),
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Default Admin
INSERT INTO users (name, email, password, role) VALUES
('Ahmed Admin', 'admin@competition.com', '$2a$10$xQjZVVq9L5Z5Z5Z5Z5Z5ZeZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', 'admin');
