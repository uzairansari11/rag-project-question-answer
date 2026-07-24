export const dbConfig = {
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/app',
};

export default dbConfig;
