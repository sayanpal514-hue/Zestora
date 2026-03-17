require('dotenv').config();
const connectDB = require('./config/db');
const { seedData, destroyData } = require('./utils/seederLogic');

const run = async () => {
  try {
    const isInMemory = await connectDB();
    if (isInMemory) {
      console.log('⚠️  Connected to In-Memory DB. Seeding is usually handled by the server in this mode.');
    }

    if (process.argv[2] === '-d') {
      await destroyData();
    } else {
      await seedData();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

run();
