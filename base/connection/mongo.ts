import mongoose from 'mongoose'
import keys from '../../config/env/keys'
export const connectMongoDb = () => {
	const connect = () => {
		const dbHost = process.env.DB_HOST || 'localhost'
		const dbPort = process.env.DB_PORT || 27017
		const dbName = process.env.DB_NAME || 'bato-backend-database'
		const mongoUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`
		// const DB_URL = keys.mongoDbUrl
		mongoose.Promise = global.Promise
		mongoose.connect(
			mongoUrl,
			{
				keepAlive: true,
				useUnifiedTopology: true,
				useNewUrlParser: true,
			},
			(err) => {
				let dbStatus = ''
				if (err) {
					dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`
				}
				dbStatus = `*    DB Connection: OK\n****************************\n`
				console.log('****************************')
				console.log('*    Starting Server')
				console.log(`*    DB_URL: ${mongoUrl}`)
				console.log(`*    Port: ${process.env.PORT || 8080}`)
				console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
				console.log(`*    Database: MongoDB`)
				console.log(dbStatus)
			}
		)
		mongoose.set('useCreateIndex', true)
		mongoose.set('useFindAndModify', false)
	}
	connect()

	mongoose.connection.on('error', console.log)
	mongoose.connection.on('disconnected', connect)
}