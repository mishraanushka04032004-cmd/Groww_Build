import app from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';

export default async function handler(req, res) {
  try {
    await connectDatabase();
  } catch (err) {
    console.error('Vercel Serverless Database Connection Error:', err);
  }
  return app(req, res);
}
