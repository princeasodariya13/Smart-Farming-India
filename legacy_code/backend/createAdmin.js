require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const email = 'princeasodariya13@gmail.com';
    const password = 'admin@123';
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists.');
    } else {
      const admin = new User({
        name: 'Super Admin',
        email,
        password,
        role: 'admin',
        login_method: 'email',
        is_verified: true,
      });
      await admin.save();
      console.log('Admin user created successfully:');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
