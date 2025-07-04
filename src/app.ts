import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './database/client'; 
import { connectRedis } from './cache/redisClient';
import apiRoutes from './routes'; 
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './docs/swagger';
import { config } from './config';

const app = express();
const PORT = config.PORT || 3000; 
setupSwagger(app);

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Database & Redis Connection
async function startServer() {
  try {
    await connectDB();
    console.log('Connected to PostgreSQL');
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); 
  }
}

startServer();