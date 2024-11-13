import { Router } from "express"
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidation } from "../utils/validation.js";
import { User } from "../mongoose/schemas/user.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { hashPassword } from "../utils/hashPassword.js";   
import {verifyAdminOrTeacher} from "../utils/verifyAdminOrTeacher.js"; 

const router = Router();


router.get('/student', verifyAdminOrTeacher, async (req, res) => {
    try {
        const data = (await User.find()).filter(user => user.role === 'student');
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.get('/student/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const dataId = req.params.id;
        const findUser = await User.findOne({_id: dataId, role: 'student'});
        const data = {
            _id: findUser._id,
            first_name: findUser.first_name,
            last_name: findUser.last_name,
            login: findUser.login,
            phone: findUser.phone,
            group_ids: findUser.group_ids
        }
        res.send(data);
    } catch (error) {
        
    }
})



router.post('/student', verifyAdminOrTeacher, checkSchema(userValidation), async (req, res) => {
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
        const student = new User(newData);
        await student.save();
        res.send(student);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.put('/student/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, login, phone, telegram_id, group_ids } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { first_name, last_name, login, phone, telegram_id, group_ids }, 
            { new: true, runValidators: true } 
        );
        res.send({ message: "Data updated successfully"});
    } catch (error) {
        res.send(error);
    }
})

router.delete('/student/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const student = await User.findByIdAndDelete({ _id: req.params.id, role: 'student' });
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router