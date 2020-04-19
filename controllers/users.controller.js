const User = require('../models/User');

const UsersController = {};

UsersController.signUp = async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL;
    const { email } = req.body;
    
    const exists = await User.findOne({ email });
    
    if (exists) {
      return await res.json({link: exists});
    }
    
    // HERE SHOULD BE NEW USER CREATION
    const link = new Link({
      code, to, from, owner: req.user.userId
    });
    
    await link.save();
    
    res.status(201).json({ link });
    
  } catch(e) {
    res.status(500).json({ message: 'Something went wrong...' });
  }
};

//tested
UsersController.getUsers = async (req, res) => {
  //for pagination. Need to add validation of req body later.
  const query = req.query;
  const search = query.search || '';
  const page = parseInt(query.page, 10) || 1;
  const pageSize = parseInt(query.pageSize, 10) || 10;
  const skip = (page - 1) * pageSize;
  const limit = pageSize;
  
  try {

    const users = await User.find({
      "$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$name", " ", "$surname", "-", "$email"]  },
          "regex": search,  //Your text search here
          "options": "i"
        }
      }
    }).select({ "name": 1, "surname": 1, "_id": 1, "role": 1, "email": 1 }).skip(skip).limit(limit).exec();
    
    const count = await User.find({
      "$expr": {
        "$regexMatch": {
          "input": { "$concat": ["$name", " ", "$surname", "-", "$email"]  },
          "regex": search,  //Your text search here
          "options": "i"
        }
      }
    }).countDocuments();
    
    return await res.status(201).json({ payload: { data: users, total: count }});
  } catch(e) {
    res.status(500).json({ message: 'Something went wrong...' });
  }
};

UsersController.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(400).json({ message: 'User not found' });
    const { email, name, surname }  = user;
    await res.status(201).json({ payload: { email, name, surname } });
  } catch(e) {
    res.status(500).json({ message: 'Something went wrong...' });
  }
};

UsersController.updateUser = async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;
    let user = await User.findByIdAndUpdate(id, { ...body });
    if(!user) return res.status(400).json({ message: 'User not found' });
    await res.status(201).json({ payload: user });
  } catch(e) {
    res.status(500).json({ message: 'Something went wrong...' });
  }
};


module.exports = UsersController;
