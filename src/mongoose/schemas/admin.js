import mongoose from "mongoose";
import {userStatus} from '../../constants/index.js'

const adminSchema = new mongoose.Schema({
    _id: Number,
    first_name: String,
    last_name: String,
    login: String,
    password: String,
    status: {
        type: String,
        enum: ['admin', 'student'],
        default: 'admin'
    }
})

export const Admin = mongoose.model('Admin', adminSchema);