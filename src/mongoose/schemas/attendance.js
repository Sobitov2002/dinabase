import mongoose, { Schema } from "mongoose";

const attendanceSchema = mongoose.Schema({
    _id: Number,
    status: Boolean,
    homework: Boolean,
    data: Date,
    teacher_id: Schema.ObjectId,
    student_id: Schema.ObjectId,
    group_id: Schema.ObjectId,
    admin_id: Schema.ObjectId,
})

export const Attendance = mongoose.model('Attendance', attendanceSchema)