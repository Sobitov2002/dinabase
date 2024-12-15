import mongoose from "mongoose";
import { Schema } from "mongoose";

const CourseSchema = new Schema(
    {
        _id: Number,
        title: String,
        description: String,
        learning: String,
        requirements: String,
        level: String,
        language: String,
        category: String,
        oldPrice: Number,
        currentPrice: Number,
        previewImage: String,
        published: {type: Boolean, default: false}
    },
    { timestamps: true }
)
export const Course = mongoose.model('Course', CourseSchema)    