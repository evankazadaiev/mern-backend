const jwt = require('jsonwebtoken');

const authSocketMiddleware = (socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token){
      try {
        const decoded = jwt.verify(socket.handshake.query.token, process.env.JWT_KEY);
        socket.decoded = decoded;
        next();
      } catch(error) {
        socket.emit('error', error);
      }
    }
};

module.exports = authSocketMiddleware;