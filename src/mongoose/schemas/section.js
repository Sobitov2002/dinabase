import mongoose from "mongoose";

const sectionSchema = mongoose.Schema({
    _id: Number,
    title: String,
    position: Number,
    courseId: mongoose.Schema.Types.ObjectId
})

export const Section = mongoose.model('Section', sectionSchema)