import { Client } from 'pg';

const client = new Client({
  user: 'postgres',
  password: 'changeme',
  host: 'localhost',
  port: 5433,
  database: 'postgres',
})


export const connectDB = async () => {
  try {
    await client.connect();
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    throw error;
  }
};

export const query = (text: string, params?: any[]) => client.query(text, params);