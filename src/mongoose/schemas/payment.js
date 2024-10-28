import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    _id: Number,
    status: Boolean,
    amount: Number,
    month: Date,
    student_id: Schema.ObjectId,
    group_id: Schema.ObjectId,
    admin_id: Schema.ObjectId
})

export const Payment = mongoose.model('Payment', paymentSchema)