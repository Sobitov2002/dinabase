import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    _id: Number,
    name: String,
    file: Buffer,
    category: {
        type: String,
        enum: ['boshlangich', 'orta', 'yuqori', 'topik'],
        default: 'boshlangich'
    }
})

export const Book = mongoose.model('Book', bookSchema)