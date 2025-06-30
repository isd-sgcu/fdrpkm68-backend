import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'admin',       
  host: process.env.DB_HOST || 'localhost',            
  database: process.env.DB_NAME || 'mydb', 
  password: process.env.DB_PASSWORD || 'admin',   
  port: 5432,                  
});


export const connectDB = async () => {
  try {
    await pool.connect();
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    throw error;
  }
};

export const query = (text: string, params?: any[]) => pool.query(text, params);