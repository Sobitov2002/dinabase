import mongoose, { Schema } from "mongoose";
import userStatus from '../../constants/index.js'

const teacherSchema = new mongoose.Schema({
    _id: Number,
    status: {
        type: String,
        enum: userStatus,
        default: userStatus[2]
    },
    first_name: String,
    last_name: String,
    login: String,
    password: String,
    phone: String,
    group_ids: [{ type: Schema.ObjectId, ref: 'Group'}],
    admin_id: Schema.ObjectId
})

export const Teacher = mongoose.model('Teacher', teacherSchema);
