import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidation } from "../utils/validation.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { hashPassword } from "../utils/hashPassword.js";
import { User } from "../mongoose/schemas/user.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";
const router = Router();

router.get('/admin', async (req, res) => {
    try {
        const data = (await User.find()).filter(user => user.role === 'admin'); 
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.get('/users', async (req, res) => {
    try {
        const data = await User.find(); 
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.post('/admin',  checkSchema(userValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        data.password = await hashPassword(data.password);
        const newId = await generateSequence('user');
        const newData = {
            _id: newId,
            ...data
        }
        const admin = new User(newData);
        await admin.save();
        res.send(admin);
    } catch (error) {
        res.send(error);
    }
})

router.put('/admin/:id', verifyAdmin, checkSchema(userValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        data.password = await hashPassword(data.password);
        const newData = {
            ...data
        }
        const admin = await User.findByIdAndUpdate(req.params.id, newData, { new: true });
        res.send(admin);
    } catch (error) {
        res.send(error);
    }
})

router.delete('/admin/:id', verifyAdmin, async (req, res) => {
    try {
        const admin = await User.findByIdAndDelete(req.params.id);
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router;