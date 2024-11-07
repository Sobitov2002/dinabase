import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import router from "./router/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT
const MongoDB_URI = process.env.MONGODB_URI
// 'mongodb://localhost/dina-academy'
mongoose
    .connect(MongoDB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err =>  console.log(err))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);

app.get('/', (req, res) => {
    res.send('Welcome to dina academy');
})


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    console.log(`key: ${MongoDB_URI}`);
    
})