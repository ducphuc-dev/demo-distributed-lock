const route = require('express')();

// const mobile_route = require("./mobile_app/index");
const webRoute = require("./web")
// const image_route = require("./image")
// const authencation = require("./auth")
// const job = require("./job")
// const video_route = require("./video")
// const public_route = require("./public")
// const webhook_routes = require("./webhook")

// const homeDataV2 = require("./v2/homeDataV2")
// const detailSizeV2 = require("./v2/detailSizeV2")

// route.use('/api/v1/mobile', mobile_route)
route.use('/api/v1/web', webRoute)
// route.use('/api/v1/image', image_route)
// route.use('/api/v1/dev/auth', authencation)
// route.use('/api/v1/dev/jobs', job)
// route.use('/api/v1/video', video_route)
// route.use('/api/v1/public', public_route)
// route.use('/api/v1/webhook', webhook_routes)


route.get('/', (req, res) => res.send('Welcome to E-commerce Project'));

module.exports = route;