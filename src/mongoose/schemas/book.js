import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    _id: Number,
    name: String,
    file: File
})

export const Book = mongoose.model('Book', bookSchema)