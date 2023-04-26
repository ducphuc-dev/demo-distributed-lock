import mongoose from 'mongoose'

export interface MovieInterface extends mongoose.Document {
    name: String,
    showtimes: Array<any>,
    created_at: Date,
    updated_at: Date
}

