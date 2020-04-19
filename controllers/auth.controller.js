const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const client = require('../helpers/client');
const redis = require('redis');

const AuthController = {};

AuthController.signUp = async (req, res) => {
  try {
    const { username, name, surname, email, password } = req.body;
    const role = 'USER';
    const profilePhoto = null;
    const candidate = await User.findOne({ email });
    if (candidate) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, name, surname, role, profilePhoto, email, password: hashedPassword });
    await user.save((err) => console.log(err));
    res.status(201).json({ message: 'User has been created!' })
  } catch(e) {
    res.status(500).json({ message: 'Something went wrong...' });
  }
};

AuthController.token = (req,res) => {
  const receivedToken = req.headers['x-refresh-token'];
  const user = jwt.verify(receivedToken, process.env.JWT_KEY);
  const savedToken = client.get(user.id);
  try {
    if(savedToken) {
      const token = jwt.sign({ id: user.id,
          role: user.role,
          email: user.email,
          name: user.name,
          surname: user.surname },
        process.env.JWT_KEY,
        { expiresIn: '1m' });
      
      const refreshToken = jwt.sign({ id: user.id,
          role: user.role,
          email: user.email,
          name: user.name,
          surname: user.surname },
        process.env.JWT_KEY,
        { expiresIn: '3m' });
      
        client.set(user.id, refreshToken, redis.print);
        client.expire(user.id, 3 * 60);
      
        return res.status(200).json({ status: 200, payload: { token, refreshToken, id: user.id } });
    } else {
      return res.status(400).json({ status: 400, message: 'Jwt expired' });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Something went wrong...' });
  }
};

AuthController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    
    const token = jwt.sign({ id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        surname: user.surname },
        process.env.JWT_KEY,
      { expiresIn: '1m' });

    const refreshToken = jwt.sign({ id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        surname: user.surname },
      process.env.JWT_KEY,
      { expiresIn: '3m' });
    
    client.set(user.id, refreshToken, redis.print);
    client.expire(user.id, 3 * 60);
  
    return res.status(200).json({ status: 200, payload: { token, refreshToken, id: user.id } });
  } catch(e) {
    return res.status(500).json({ message: 'Something went wrong...' });
  }
};

AuthController.getMe = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById({ _id: id }).populate({ 
        path: 'rooms',
        model: 'Room'
     });

    return res.status(200).json({ payload: user });
  } catch(e) {
    return res.status(500).json({ message: 'Something went wrong...' });
  }
};

AuthController.changeOnline = async (req, res) => {
  const { isOnline } = req.body;
  try {
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, { isOnline }, {new: true});

    return res.status(200).json({ payload: user });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong...' });
  }
};

module.exports = AuthController;
