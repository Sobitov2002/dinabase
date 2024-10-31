import express from "express";
import mongoose from "mongoose";
import router from "./router/index.js";

const app = express();

mongoose
    .connect('mongodb://localhost/dina-academy')
    .then(() => console.log('MongoDB connected'))
    .catch(err =>  console.log(err))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);

app.get('/', (req, res) => {
    res.send('Welcome to dina academy');
})


const PORT = 3002 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://172.27.7.255:${PORT}`);
})