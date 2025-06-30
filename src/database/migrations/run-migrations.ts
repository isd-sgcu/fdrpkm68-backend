// src/database/migrations/run-migrations.ts
import { query, connectDB } from '../client';
import fs from 'fs/promises';
import path from 'path';

async function runMigrations() {
  await connectDB();
  console.log('ConnectedDB successfully');

  const migrationFiles = [
    '20240701_create_users_and_event_logs.sql', 
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, file);
    try {
      const sql = await fs.readFile(filePath, 'utf-8');
      await query(sql);
      console.log(`Migration ${file} executed successfully.`);
    } catch (error) {
      console.error(`Error executing migration ${file}:`, error);
      process.exit(1);
    }
  }

  process.exit(0);
}

runMigrations();