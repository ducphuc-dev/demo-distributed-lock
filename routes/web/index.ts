const webRouter = require('express')();

const user = require('./user')

webRouter.use('/users', user)

module.exports = webRouter