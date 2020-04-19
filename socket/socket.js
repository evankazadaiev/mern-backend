const socketio = require('socket.io');
const services = require('./services');
const SOCKET_EVENTS = require('../constants/socket-events');
const authSocketMiddleware = require('./socket_auth');

module.exports = class Socket {
  constructor(app) {
    this.io = socketio(app).of('/chat').use(authSocketMiddleware);
    this.initListeners();
  }
  initListeners() {
    this.io.on(SOCKET_EVENTS.CONNECTION, socket => {
      console.log('USER CONNECTED');
      socket.on(SOCKET_EVENTS.JOIN_ROOM, async (roomId) => await this.onJoin(socket, roomId));
      socket.on(SOCKET_EVENTS.ROOMS, async (id) => await this.onRooms(socket, id));
      socket.on(SOCKET_EVENTS.MESSAGE, async (data) => await this.onMessage(data));
      socket.on(SOCKET_EVENTS.LEAVE, async (roomId) => await this.onLeave(socket, roomId));
      socket.on('error', status => {
        console.log('got exception!!!!!!!!!!');
        socket.emit('exception', status)
      });
    });
    this.io.on('disconnect', socket => {
      console.log('USER DISCONNECTED');
      socket.removeAllListeners();
    });
  }
  async onJoin(socket, roomId) {
    socket.join(roomId);
    const messages = await services.getMessages(roomId);
    this.io.to(roomId).emit(SOCKET_EVENTS.JOIN_ROOM, messages);
    console.log('joining room >>> ', roomId);
  }
  async onRooms(socket, id) {
    console.log('he asks for rooms!')
    const rooms = await services.getRooms(id);
    socket.emit(SOCKET_EVENTS.ROOMS, rooms);
  }
  async onMessage({ roomId, message }) {
    try {
      const newMessage = await services.sendMessage(roomId, message);
      this.io.to(roomId).emit(SOCKET_EVENTS.MESSAGE, newMessage);
    } catch(error) {
      throw error;
    }
  }
  onLeave(socket, roomId) {
    console.log('leaving room >>> ', roomId);
    socket.leave(roomId);
  }
}
