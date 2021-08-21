import { config } from 'dotenv'
config()

export default {
    mongoDbUrl: process.env.MONGO_URI_STAGING,
    jwtSecret: process.env.JWT_SECRET_STAGING,
    host: process.env.HOST_STAGING,
    whitelist: "*"
}
