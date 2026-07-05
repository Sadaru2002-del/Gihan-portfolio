import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let dbMode = 'json'; // default to json fallback

const DB_FILE_PATH = path.join(__dirname, '../data/db.json');

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.log('⚠️  No MONGO_URI environment variable found. Falling back to local JSON database.');
    initializeJsonDB();
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Quick fail if MongoDB is not running
    });
    dbMode = 'mongodb';
    console.log('🚀 MongoDB connected successfully!');
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('⚠️  Falling back to local JSON database.');
    initializeJsonDB();
  }
};

const initializeJsonDB = () => {
  const dirPath = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE_PATH)) {
    const defaultData = {
      users: [],
      projects: [],
      blogs: [],
      messages: [],
      skills: [],
      certificates: [],
      testimonials: [],
      analytics: [],
      settings: {
        siteName: 'Gihan Suminda - Brand Platform',
        theme: 'dark',
        seoKeywords: 'Gihan Suminda, Software Engineer, Portfolio, Full Stack Intern',
        seoDescription: 'Personal brand ecosystem and portfolio of Gihan Suminda, Software Engineering Undergraduate.'
      }
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    console.log('📁 Created local JSON database at server/data/db.json');
  } else {
    console.log('📁 Local JSON database loaded successfully.');
  }
};
