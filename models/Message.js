const { Schema, model, Types } = require('mongoose');


const schema = new Schema({
  content: {type: String, required: true},
  type: {type: String, required: true, default: 'text'},
  read: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  userFrom: {type: Types.ObjectId, ref: 'User', required: true},
  userTo: {type: Types.ObjectId, ref: 'User', required: true},
  room: {
    type: Types.ObjectId,
    ref: 'Room'
  }
});

module.exports = model('Messages', schema);
