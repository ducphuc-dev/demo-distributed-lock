import mongoose from 'mongoose'
import { E_VERIFY_TYPE } from '../base/variable';
import { databaseValidate } from '../utils/databaseValidate';
import { UserInterface } from './interface/UserInterface';
const paginate = require('./plugins/paginate');
const aggregatePaginate = require('./plugins/aggregatePaginate');

const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        index: true, 
        unique: true,
        required: [true, databaseValidate('missing', 'user_name', 'User')]
    },
    email: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: true
})

UserSchema.plugin(paginate);
UserSchema.plugin(aggregatePaginate);

const UserModel = mongoose.model<UserInterface>('User', UserSchema);
export default UserModel;

