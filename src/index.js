import express from "express";
import mongoose from "mongoose";

const app = express();

mongoose
    .connect('mongodb://localhost/dina-academy')
    .then(() => console.log('MongoDB connected'))
    .catch(err =>  console.log(err))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Welcome to dina academy');
})

const PORT = 3008 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})