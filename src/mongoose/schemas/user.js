import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: Number,
    role: {
        type: String,
        enum: ['admin', 'student', 'teacher'],
        default: 'admin'
    },
    first_name: String,
    last_name: String,
    login: String,
    password: String,
    phone: String,
    telegram_id: String,
    group_ids: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
})

export const User = mongoose.model('User', userSchema);