import 'dotenv/config'; 
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './database/client'; 
import { connectRedis } from './cache/redisClient';
import apiRoutes from './routes'; 
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './docs/swagger';
import { config } from './config';

const app = express();
const PORT = config.PORT || 8080; 
setupSwagger(app);

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:4321',           // Local frontend
    'https://dev.freshmenfest2025.com', // Dev frontend
    'https://freshmenfest2025.com'      // Prod frontend
  ]
}));
app.use(bodyParser.json());
// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/', apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Database & Redis Connection
async function startServer() {
  try {
    // Check if we have real database/Redis URLs
    const isDummyDB = !process.env.DATABASE_URL || 
                     process.env.DATABASE_URL.includes('placeholder') ||
                     process.env.DATABASE_URL.includes('dummy') ||
                     process.env.DATABASE_URL.includes('dev-host') ||
                     process.env.DATABASE_URL.includes('user:password');
    
    const isDummyRedis = !process.env.REDIS_URL || 
                        process.env.REDIS_URL.includes('placeholder') ||
                        process.env.REDIS_URL.includes('dummy') ||
                        process.env.REDIS_URL.includes('dev-redis-host') ||
                        process.env.REDIS_URL.includes('user:password');

    if (isDummyDB) {
      console.log('⚠️  Database disabled - using dummy connection');
    } else {
      await connectDB();
      console.log('✅ Connected to PostgreSQL');
    }

    if (isDummyRedis) {
      console.log('⚠️  Redis disabled - using dummy connection');
    } else {
      await connectRedis();
      console.log('✅ Connected to Redis');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); 
  }
}

startServer();