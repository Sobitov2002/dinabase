import mongoose from "mongoose";

const lessonSchema = mongoose.Schema({
    _id: Number,
    title: String,
    position: Number,
    videoUrl: String,
    duration: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 },
        seconds: { type: Number, default: 0 }
    },
    sectionId: Number
})

export const Lesson = mongoose.model('Lesson', lessonSchema)