const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Message');

const ChatController = {};


ChatController.initRoom = async (req, res) => {
  const { id: from } = req.user;

  const { id: to } = req.body;

  const message = null;
  
  const ids = [from, to];

  // const filtered = [...users].map(u => ({ ...u, profilePhoto: null }));

  // console.log(filtered);
  
  
  const output = {
    users: ids,
    lastMessage: message,
  };

  const exists = await Room.findOne({ users: { $all: [...ids] } });
  if(exists) {
    const room = exists.populate('users', 'name surname role profilePhoto isOnline');
    return res.status(200).json({ status: 200, payload: room });
  }
  const room = new Room(output);
  await room.save();
  const populated = room.populate('users', 'name surname role profilePhoto isOnline');
  
  return res.status(200).json({ status: 200, payload: populated });
};


ChatController.getRooms = async (req, res) => {
  try {
    const { id } = req.user;
    
    const { rooms } = await User.findById(id).populate({
      path: 'rooms',
      populate: {
        path: 'users',
        select: 'name _id surname profilePhoto role',
        model: 'User'
      }
    });

    return res.status(200).json({ status: 200, payload: { rooms } })
  } catch (error) {
    return res.status(400).json({ status: 400, message: 'User not found' });
  }
};


ChatController.sendMessage = async (req, res) => {
  try {
    const { id: userFrom } = req.user;
    const { id: userTo, room, type, content } = req.body;
    
    const message = new Message({ userFrom, userTo, room, type, content });
    await message.save();

    return res.status(200).json({ status: 200, payload: message });
  } catch (error) {
    return res.status(401).json({ status: 401, payload: 'Something gone wrong' });
  }
};

module.exports = ChatController;
