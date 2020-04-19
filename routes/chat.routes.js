const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth.middleware');

const { initRoom, getRooms, sendMessage } = require('../controllers/chat.controller');

router.post('/rooms/init', auth, initRoom);

router.get('/rooms', auth, getRooms);

router.post('/message', auth, sendMessage);

module.exports = router;
