import mongoose from 'mongoose'

export interface UserInterface extends mongoose.Document {
    user_name: String,
    first_name?: String,
    last_name?: String,
    birthday: Date,
    address: Object,
    email?: String,
    phone: String,
    verify_information: Object,
    password: String,
    avatar_url?: String,
    created_at: Date,
    updated_at: Date
}

