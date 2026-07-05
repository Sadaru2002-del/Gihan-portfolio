import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbMode } from '../config/db.js';

// Import mongoose models
import User from './User.js';
import Project from './Project.js';
import Blog from './Blog.js';
import Message from './Message.js';
import Skill from './Skill.js';
import Certificate from './Certificate.js';
import Testimonial from './Testimonial.js';
import Analytics from './Analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, '../data/db.json');

// Helper to generate 24-char hex string (ObjectId compatible)
const generateId = () => {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

// JSON database helper operations
const readJsonDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
};

const writeJsonDB = (data) => {
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

const makeCollectionStore = (collectionName, mongooseModel) => {
  return {
    find: async (filter = {}) => {
      if (dbMode === 'mongodb') {
        return await mongooseModel.find(filter).sort({ order: 1, createdAt: -1 });
      } else {
        const db = readJsonDB();
        let items = db[collectionName] || [];
        
        // Simple filter matching
        return items.filter(item => {
          for (let key in filter) {
            if (filter[key] !== undefined && item[key] !== filter[key]) {
              return false;
            }
          }
          return true;
        });
      }
    },
    
    findOne: async (filter = {}) => {
      if (dbMode === 'mongodb') {
        return await mongooseModel.findOne(filter);
      } else {
        const db = readJsonDB();
        const items = db[collectionName] || [];
        return items.find(item => {
          for (let key in filter) {
            if (filter[key] !== undefined && item[key] !== filter[key]) {
              return false;
            }
          }
          return true;
        }) || null;
      }
    },
    
    findById: async (id) => {
      if (dbMode === 'mongodb') {
        return await mongooseModel.findById(id);
      } else {
        const db = readJsonDB();
        const items = db[collectionName] || [];
        return items.find(item => item._id === id || item.id === id) || null;
      }
    },
    
    create: async (data) => {
      if (dbMode === 'mongodb') {
        return await mongooseModel.create(data);
      } else {
        const db = readJsonDB();
        if (!db[collectionName]) db[collectionName] = [];
        
        const newItem = {
          _id: generateId(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db[collectionName].push(newItem);
        writeJsonDB(db);
        return newItem;
      }
    },
    
    findByIdAndUpdate: async (id, updateData) => {
      if (dbMode === 'mongodb') {
        return await mongooseModel.findByIdAndUpdate(id, updateData, { new: true });
      } else {
        const db = readJsonDB();
        const items = db[collectionName] || [];
        const index = items.findIndex(item => item._id === id);
        
        if (index === -1) return null;
        
        items[index] = {
          ...items[index],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        db[collectionName] = items;
        writeJsonDB(db);
        return items[index];
      }
    },
    
    findByIdAndDelete: async (id) => {
      if (dbMode === 'mongodb') {
        return await mongooseModel.findByIdAndDelete(id);
      } else {
        const db = readJsonDB();
        const items = db[collectionName] || [];
        const index = items.findIndex(item => item._id === id);
        
        if (index === -1) return null;
        
        const deletedItem = items.splice(index, 1)[0];
        db[collectionName] = items;
        writeJsonDB(db);
        return deletedItem;
      }
    },
    
    countDocuments: async (filter = {}) => {
      if (dbMode === 'mongodb') {
        return await mongooseModel.countDocuments(filter);
      } else {
        const db = readJsonDB();
        const items = db[collectionName] || [];
        return items.filter(item => {
          for (let key in filter) {
            if (filter[key] !== undefined && item[key] !== filter[key]) {
              return false;
            }
          }
          return true;
        }).length;
      }
    }
  };
};

export const Users = makeCollectionStore('users', User);
export const Projects = makeCollectionStore('projects', Project);
export const Blogs = makeCollectionStore('blogs', Blog);
export const Messages = makeCollectionStore('messages', Message);
export const Skills = makeCollectionStore('skills', Skill);
export const Certificates = makeCollectionStore('certificates', Certificate);
export const Testimonials = makeCollectionStore('testimonials', Testimonial);
export const AnalyticsStore = makeCollectionStore('analytics', Analytics);

// Simple Settings Manager
export const SettingsStore = {
  get: async () => {
    if (dbMode === 'mongodb') {
      // Create a default if not found
      return {
        siteName: 'Gihan Suminda - Brand Platform',
        theme: 'dark',
        seoKeywords: 'Gihan Suminda, Software Engineer, Portfolio, Full Stack Intern',
        seoDescription: 'Personal brand ecosystem and portfolio of Gihan Suminda, Software Engineering Undergraduate.'
      };
    } else {
      const db = readJsonDB();
      return db.settings || {};
    }
  },
  update: async (data) => {
    if (dbMode === 'mongodb') {
      return data;
    } else {
      const db = readJsonDB();
      db.settings = { ...db.settings, ...data };
      writeJsonDB(db);
      return db.settings;
    }
  }
};
