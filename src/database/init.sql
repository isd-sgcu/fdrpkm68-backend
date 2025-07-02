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
CREATE TYPE housesize_letter_type AS ENUM ('S', 'M', 'L', 'XL', 'XXL');
CREATE TYPE group_role_type AS ENUM ('OWNER', 'MEMBER');


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


-- Houses schema
CREATE TABLE house_sizes (
    size_letter housesize_letter_type PRIMARY KEY NOT NULL,
    max_member INT NOT NULL
);

CREATE TABLE houses (
    name_thai TEXT PRIMARY KEY NOT NULL,
    name_english TEXT NOT NULL,
    logo TEXT NOT NULL, -- TEXT as placeholder, not sure which data type for house picture
    description_thai TEXT NOT NULL,
    description_english TEXT NOT NULL,
    size_letter housesize_letter_type NOT NULL,
    member_count INT NOT NULL,
    instagram TEXT NOT NULL,
    house_id TEXT NOT NULL, -- here for "easier" retrieval of houses
    CONSTRAINT fk_size_letter FOREIGN KEY (size_letter) REFERENCES house_sizes(size_letter)
);


-- Group schema
CREATE TABLE groups (
    group_id TEXT PRIMARY KEY NOT NULL,
    submitted BOOLEAN DEFAULT FALSE NOT NULL,
    selected_houses TEXT[6] DEFAULT ARRAY[NULL, NULL, NULL, NULL, NULL, NULL] NOT NULL, -- ordered: 1st, 2nd, ..., 5th, extra
    CONSTRAINT selected_houses_length_6 CHECK (cardinality(selected_houses) = 6)
);

ALTER TABLE users
ADD group_id TEXT NOT NULL,
ADD group_role group_role_type NOT NULL,
ADD CONSTRAINT fk_group_id FOREIGN KEY (group_id) REFERENCES "groups"(group_id);



