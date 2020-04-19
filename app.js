require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//services
const SocketService = require('./socket/socket');

//middleware
const errorHandler = require('./middleware/error-handler.middleware');

//routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/t', require('./routes/redirect.routes'));
app.use(errorHandler);

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

start().then(() => {
  console.log('Connected to database');
  // initRoom()
});

const server = app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
const Socket = new SocketService(server);
