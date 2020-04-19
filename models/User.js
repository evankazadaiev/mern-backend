const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  isOnline: {
    type: Boolean,
  },
  rooms: [
    {
      type: Types.ObjectId,
      ref: 'Room'
    }
  ]
});

const User = model('User', schema);


module.exports = User;


  // phone: {
  //   type: String,
  //   validate: {
  //     validator: function(v) {
  //       return /\d{3}-\d{3}-\d{4}/.test(v);
  //     },
  //     message: props => `${props.value} is not a valid phone number!`
  //   },
  //   required: [true, 'User phone number required']
  // },

  // links: [
  //   {
  //     type: Types.ObjectId,
  //     ref: 'Link'
  //   }
  // ]