import * as userWebFunctions from '../../controller/api/web/UserController';
const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/create-seller').post(userWebFunctions.createUser);

module.exports = router;