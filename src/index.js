import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import router from "./router/index.js";
import cors from "cors";

import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/swagger/swagger_output.json', 'utf8'));


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
app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173', // frontend domeningizni belgilang
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // kerakli HTTP metodlarini ruxsat eting
    credentials: true, // agar cookie bilan ishlayotgan bo'lsangiz
}));

app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});
app.use(router);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('Welcome to dina academy');
})


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);    
})