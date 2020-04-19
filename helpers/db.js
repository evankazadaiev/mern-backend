const mongoose = require('mongoose');
const start = async () => {
  try {
    return await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  } catch (e) {
    console.log(`Server error ${e.message}`);
    process.exit(1);
  }
};

start.then(() => console.log('Mongo db is connected'));

mongoose.Promise = global.Promise;

module.exports = {
  User: require('../models/User.js')
};
