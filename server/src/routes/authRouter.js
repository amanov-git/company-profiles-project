const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { validateBody } = require('../scripts/helpers/schemaValidate');
const { registerSchema, loginSchema } = require('../scripts/schemas/authSchemas');

router.post('/register', validateBody(registerSchema), register);

router.post('/login', validateBody(loginSchema), login);

module.exports = router;