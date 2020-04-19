const { Schema, model, Types } = require('mongoose');
const User = require('./User');

const lastMessage = new Schema({
  createdAt: Date,
  type: {type: String, required: true, default: 'text'},
  content: { type: String, required: true },
  userFrom: {type: Types.ObjectId, ref: 'User', required: true},
});


const room = new Schema({
  users: [{
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: lastMessage,
    default: null
  },
  messages: {
    type: Types.ObjectId,
    ref: 'Message'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

room.set('autoIndex', true);

room.post('save', async function(doc, next) {
  const { users, _id } = doc;
  const updated = await User.updateMany({ _id: users }, { $push: { rooms: _id } })

  console.log(updated);
  next();
});

module.exports = model('Room', room);
