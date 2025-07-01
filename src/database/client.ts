import { Client } from 'pg';
import { config } from '../config';


const client = new Client({
  //this is for TESTING purposes only btw
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: parseInt(config.DB_PORT as string, 10),
  database: config.DB_NAME,
})


export const connectDB = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    throw error;
  }
};

export const query = (text: string, params?: any[]) => client.query(text, params);