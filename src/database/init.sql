-- Create ENUM types
CREATE TYPE prefix_type AS ENUM ('MR', 'MS', 'OTHER');
CREATE TYPE faculty_id AS ENUM (
    'SCIENCE',
    'ENGINEER',
    'MEDICINE',
    'ARTS',
    'EDUCATION',
    'PSYCHOLOGY',
    'DENTISTRY',
    'LAW',
    'COMMUNICATION_ARTS',
    'NURSING',
    'COMMERCE_AND_ACCOUNTANCY',
    'PHARMACEUTICAL_SCIENCE',
    'POLITICAL_SCIENCE',
    'SPORTS_SCIENCE',
    'FINE_AND_APPLIED_ARTS',
    'ECONOMICS',
    'ARCHITECTURE',
    'ALLIED_HEALTH_SCIENCES',
    'VETERINARY_SCIENCE'
);
CREATE TYPE role_type AS ENUM ('STAFF', 'FRESHMAN');
CREATE TYPE event_type AS ENUM ('FIRSTDATE', 'RPKM', 'FRESHMENNIGHT');
CREATE TYPE checkin_status_type AS ENUM ('PRE_REGISTER', 'EVENT_REGISTER');

-- Create "users" table
CREATE TABLE users (
    student_id VARCHAR(10) NOT NULL,
    citizen_id VARCHAR(13) NOT NULL,
    prefix prefix_type NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    academic_year INTEGER NOT NULL,
    faculty faculty_id NOT NULL,
    password_hash TEXT NOT NULL, 
    phone_number TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone_number TEXT NOT NULL,
    parent_relationship TEXT NOT NULL,
    food_allergy TEXT DEFAULT NULL,
    drug_allergy TEXT DEFAULT NULL,
    illness TEXT DEFAULT NULL,
    avatar_id SMALLINT DEFAULT 1 NOT NULL,
    role role_type DEFAULT 'FRESHMAN' NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (student_id, citizen_id)
);

-- Create "checkin" table
CREATE TABLE "checkin" (
    id SERIAL PRIMARY KEY,
    user_student_id VARCHAR(10) NOT NULL,
    user_citizen_id VARCHAR(13) NOT NULL,
    event event_type NOT NULL,
    status checkin_status_type NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    
    FOREIGN KEY (user_student_id, user_citizen_id) REFERENCES users (student_id, citizen_id),
    UNIQUE(user_student_id, user_citizen_id, event)
);
