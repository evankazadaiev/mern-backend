const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth.middleware');
const noAuth = require('../middleware/no-auth.middleware');


const { signUp, login, token, getMe, changeOnline } = require('../controllers/auth.controller');

router.post('/sign-up', noAuth, signUp);

router.post('/login', noAuth, login);

router.post('/token', token);

router.get('/me', auth, getMe);

router.put('/online', auth, changeOnline);


module.exports = router;
