import * as userWebFunctions from '../../controller/api/web/UserController';
const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/').post(userWebFunctions.createUser);
router.route('/movies').post(userWebFunctions.createMovie);
router.route("/movies/ticket").post(userWebFunctions.userBuyTicket);

module.exports = router;