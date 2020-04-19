const { Router } = require('express');
const { signUp, getUsers, getUserById, updateUser } = require('../controllers/users.controller');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.post('/', auth, signUp);

router.get('/', auth, getUsers);

router.get('/:id', auth, getUserById);

router.put('/update/:id', auth, updateUser);

module.exports = router;
