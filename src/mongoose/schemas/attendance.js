import mongoose, { Schema } from "mongoose";

const attendanceSchema = mongoose.Schema({
    _id: Number,
    status: Boolean,
    homework: Boolean,
    data: Date,
    teacher_id: Number,
    student_id: Number,
    group_id: Number,
    isActive: Boolean
})

export const Attendance = mongoose.model('Attendance', attendanceSchema)