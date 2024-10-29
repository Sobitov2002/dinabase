import { Router } from "express"
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidation } from "../utils/validation.js";
import { User } from "../mongoose/schemas/user.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { hashPassword } from "../utils/hashPassword.js";   
import {verifyAdminOrTeacher} from "../utils/verifyAdminOrTeacher.js"; 

const router = Router();

router.get('/student', async(req, res) => {
    try {
        const user = (await User.find()).filter(user => user.role === 'student');
        res.send(user);
    } catch (error) {
        res.send(error);
    }
})

router.post('/student', verifyAdminOrTeacher, checkSchema(userValidation), async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(422).send(err);
    }
    const data = matchedData(req);
    data.password = await hashPassword(data.password);
    try {
        const newId = await generateSequence('student');
        const newData = {
            _id: newId,
            ...data
        }
        const student = new User(newData);
        await student.save();
        res.send(student);
    } catch (error) {
        res.send(error);
    }
})

router.put('/student/:id', verifyAdminOrTeacher, checkSchema(userValidation), async (req, res) => {
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
        const student = await User.findByIdAndUpdate(req.params.id, newData, { new: true });
        res.send(student);
    } catch (error) {
        res.send(error);
    }
})

router.delete('/student/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const student = await User.findByIdAndDelete(req.params.id);
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router