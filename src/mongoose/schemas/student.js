import mongoose, { Schema } from "mongoose";
import userStatus from '../../constants/index.js'

const studentSchema = new mongoose.Schema({
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
    telegram_id: Number,
    phone: String,
    group_ids: [{ type: Schema.ObjectId, ref: 'Group'}],
    admin_id: Schema.ObjectId
})

export const Student = mongoose.model('Student', studentSchema);
