import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidation } from "../utils/validation.js";
import { User } from "../mongoose/schemas/user.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { hashPassword } from "../utils/hashPassword.js";  
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = Router();

router.get('/teacher', verifyAdmin, async (req, res) => {
    try {
        const data = (await User.find()).filter(user => user.role === 'teacher');
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.get('/teacher/:id', verifyAdmin, async (req, res) => {
    try {
        const teacher = await User.findById({ _id: req.params.id, role: 'teacher' });
        if (!teacher) {
            return res.status(404).send('Teacher not found');
        }
        const password = await hashPassword(teacher.password, false);
        teacher.password = password;
        res.send(teacher);
    } catch (error) {
        res.send(error);
    }
})

router.post('/teacher', verifyAdmin, checkSchema(userValidation), async (req, res) => {
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
        const teacher = new User(newData);
        await teacher.save();
        res.send(teacher);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.put('/teacher/:id', verifyAdmin, checkSchema(userValidation), async (req, res) => {
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
        const teacher = await User.findByIdAndUpdate(req.params.id, newData, { new: true });
        res.send(teacher);
    } catch (error) {
        res.send(error);
    }
})

router.delete('/teacher/:id', verifyAdmin, async (req, res) => {
    try {
        const teacher = await User.findByIdAndDelete({ _id: req.params.id, role: 'teacher' });
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router