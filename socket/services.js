const User = require('../models/User');
const Message = require('../models/Message');

module.exports = (function() {
    return {
        async getRooms(id) {
            try {
            if(!id) throw Error();
            const { rooms } = await User.findById(id).populate({
                path: 'rooms',
                populate: {
                path: 'users',
                select: 'name _id surname profilePhoto role',
                model: 'User'
                }
            });
        
            // console.log(rooms);
        
            return rooms;
            } catch (error) {
                return error.message;
            }
        },
        async getMessages(room) {
            try {
              const messages = await Message.find({ room }).populate({
                  path: 'userFrom',
                  path: 'userTo'
              });
            //   console.log(messages);
              return messages;
            } catch (error) {
              return error.message;
            }
        },
        async sendMessage(roomId, message) {
            try {
                const { userFrom, userTo, room, type, content } = message;
                
                const newMessage = new Message({ userFrom, userTo, room, type, content });

                console.log('MESSAGE >>> ', newMessage);
                await newMessage.save();
                return newMessage;
            } catch (error) {
                return error.message;
            }
        }
    }
})();