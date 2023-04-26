import mongoose from 'mongoose'

export interface UserInterface extends mongoose.Document {
    user_name: String,
    email?: String,
    created_at: Date,
    updated_at: Date
}

