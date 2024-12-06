import { Schema } from "mongoose";

const CourseSchema = new Schema(
    {
        _id: Number,
        title: String,
        description: String,
        requirements: String,
        level: String,
        category: String,
        language: String,
        oldPrice: Number,
        currentPrice: Number,
        previewImage: String,
        published: {type: Boolean, default: false}
    },
    { timestamps: true }
)
const Course = module.Course || model('Course', CourseSchema)
export default Course