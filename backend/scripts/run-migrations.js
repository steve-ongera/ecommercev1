const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigrations() {
  try {
    console.log('📦 Running database migrations...');
    
    const migrationsDir = path.join(__dirname, '../db/migrations');
    const files = fs.readdirSync(migrationsDir).sort();
    
    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await db.query(sql);
        console.log(`✓ ${file} completed`);
      }
    }
    
    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    process.exit();
  }
}

runMigrations();