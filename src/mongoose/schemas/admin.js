import mongoose from "mongoose";
import userStatus from '../../constants/index.js'

const adminSchema = new mongoose.Schema({
    _id: Number,
    first_name: String,
    last_name: String,
    login: String,
    password: String,
    status: {
        type: String,
        enum: userStatus,
        default: userStatus[0]
    }
})

export const Admin = mongoose.model('Admin', adminSchema);