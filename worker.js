import 'dotenv/config';
import './src/workers/document.worker.js';
console.log('🚀 Document worker started...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
