-- Table for Users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password TEXT NOT NULL,
  user_type VARCHAR(20) NOT NULL, -- 'student' or 'instructor'
  profile_photo TEXT DEFAULT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

-- Table for Instructor Profiles
CREATE TABLE IF NOT EXISTS instructor_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  headline TEXT DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  expertise TEXT DEFAULT NULL,
  website TEXT DEFAULT NULL,
  linkedin_url TEXT DEFAULT NULL,
  twitter_url TEXT DEFAULT NULL,
  country VARCHAR(100) DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  languages JSON DEFAULT NULL,
  specializations JSON DEFAULT NULL,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  bio TEXT DEFAULT NULL,
  interests JSON DEFAULT NULL,
  learning_goals TEXT DEFAULT NULL,
  experience VARCHAR(50) DEFAULT NULL, -- 'beginner', 'intermediate', 'advanced'
  country VARCHAR(100) DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for Courses
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(36) PRIMARY KEY,
  instructor_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  category VARCHAR(100) DEFAULT NULL,
  level VARCHAR(50) DEFAULT NULL,
  language VARCHAR(50) DEFAULT NULL,
  price DECIMAL(10,2) DEFAULT NULL,
  original_price DECIMAL(10,2) DEFAULT NULL,
  duration VARCHAR(50) DEFAULT NULL,
  thumbnail_url TEXT DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  is_published BOOLEAN DEFAULT FALSE,
  what_youll_learn JSON DEFAULT NULL,
  requirements JSON DEFAULT NULL,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for Modules
CREATE TABLE IF NOT EXISTS modules (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  order_index INT NOT NULL,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Table for Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(36) PRIMARY KEY,
  module_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  duration VARCHAR(20) DEFAULT NULL,
  video_url TEXT DEFAULT NULL,
  order_index INT NOT NULL,
  is_preview BOOLEAN DEFAULT FALSE,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Table for Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  enrollment_date DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  amount_paid DECIMAL(10,2) DEFAULT NULL,
  progress INT DEFAULT 0,
  completed_at DATETIME(3) DEFAULT NULL,
  certificate_issued BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Table for Course Reviews
CREATE TABLE IF NOT EXISTS course_reviews (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL,
  comment TEXT DEFAULT NULL,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Table for Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  lesson_id VARCHAR(36) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME(3) DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);
