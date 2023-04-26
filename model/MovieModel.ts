import mongoose from 'mongoose'
import { E_VERIFY_TYPE } from '../base/variable';
import { databaseValidate } from '../utils/databaseValidate';
import { MovieInterface } from './interface/MovieInterface';
const paginate = require('./plugins/paginate');
const aggregatePaginate = require('./plugins/aggregatePaginate');

const TicketSchema = new mongoose.Schema({
    ticket_id: "String", // combine row and chair number: A1,...
    status: {
        type: String,
        enum: ["empty", "ordered"]
    },
    user_id: mongoose.Types.ObjectId || null,
    ordered_at: Date || null
}, {
    _id: false
})

const ShowTimeSchema = new mongoose.Schema({
    start_time: String,
    end_time: String,
    room: String,
    tickets: [TicketSchema]
}, {
    _id: true
})

const MovieSchema = new mongoose.Schema({
    name: String,
    duration: Number,
    m_id: String,
    showtimes: [ShowTimeSchema]
}, {
    versionKey: false,
    timestamps: true
})

MovieSchema.plugin(paginate);
MovieSchema.plugin(aggregatePaginate);

const MovieModel = mongoose.model<MovieInterface>('Movie', MovieSchema);
export default MovieModel;

