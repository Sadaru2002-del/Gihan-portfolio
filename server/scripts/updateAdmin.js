import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, dbMode } from '../config/db.js';
import { Users } from '../models/dbStore.js';

dotenv.config();

const updateAdmin = async () => {
  console.log('🔐 Updating admin credentials...');
  await connectDB();

  try {
    const newEmail    = 'thanivunum@gmail.com';
    const newPassword = '20021217@';
    const newName     = 'Yashika Portfolio Admin';

    // Hash the new password
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Find any existing admin and update, or create fresh
    const existing = await Users.findOne({ role: 'admin' });

    if (existing) {
      existing.email    = newEmail;
      existing.password = hashedPassword;
      existing.name     = newName;
      await Users.save(existing);
      console.log(`✅ Admin updated  →  ${newEmail}  /  ${newPassword}`);
    } else {
      await Users.create({
        name:     newName,
        email:    newEmail,
        password: hashedPassword,
        role:     'admin',
        avatar:   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
        bio:      'Portfolio Administrator'
      });
      console.log(`✅ Admin created  →  ${newEmail}  /  ${newPassword}`);
    }

    console.log('\n📋 Login credentials:');
    console.log(`   Email    : ${newEmail}`);
    console.log(`   Password : ${newPassword}`);
    console.log('\n🌐 Login URL: http://localhost:5174/#/login');
    
  } catch (err) {
    console.error('❌ Update failed:', err);
  } finally {
    if (dbMode === 'mongodb') {
      const m = await import('mongoose');
      m.default.connection.close();
    }
    process.exit(0);
  }
};

updateAdmin();
