const mongoose = require('mongoose');
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB connected');
  console.log(`MONGO_URI: ${process.env.MONGO_URI}`);
};
module.exports = connectDB;
