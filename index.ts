import bodyParser from 'body-parser';
import { config } from 'dotenv';
import express from 'express';
import morganBody from 'morgan-body';
import path from 'path';
import corsOptions from './config/env/cors';
import { connectMongoDb } from './base/connection/mongo';
import { handleError } from './base/handleError';
import injector from './base/injector';
import logs_config from './base/log';
const cors = require('cors');
const rootRoute = require('./routes/index');
// import './services/cronjob';
import keys from './config/env/keys';

const app = express();

config();
connectMongoDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(injector);
app.use(cors(corsOptions));
morganBody(app, logs_config);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', rootRoute);
app.use(handleError);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`* ### Start with port: ${process.env.PORT || 8080} *`);
});


let allowList: any;
switch (process.env.NODE_ENV) {
    case 'development':
        allowList = keys.whitelist;
        break;
    case 'staging':
        allowList = keys.whitelist;
        break
    case 'production':
        allowList = keys.whitelist; // :v
        break;
    case 'test':
        allowList = keys.whitelist;
        break;
    default:
        allowList = '*';
        break;
}

const PORT = process.env.PORT_SOCKET || 3003;

const httpServer = require('http').createServer();
httpServer.listen(PORT, () =>
    console.log(`server listening at http://localhost:${PORT}`)
);
