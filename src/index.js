import express from "express";
import mongoose from "mongoose";
import router from "./router/index.js";

const app = express();
const MongoDB_URI = 'mongodb+srv://muhammadali0210:nQmAJ9J9fzArxyRB@dina-backend.nm7jw.mongodb.net/?retryWrites=true&w=majority&appName=dina-backend'
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


const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    console.log(`key: ${MongoDB_URI}`);
    
})