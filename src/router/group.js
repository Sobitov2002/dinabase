import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { groupValidation } from "../utils/validation.js";
import { Group } from "../mongoose/schemas/group.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import { User } from "../mongoose/schemas/user.js";

const router = Router();

router.get('/group', async (req, res) => {
    const data = await Group.find();
    res.send(data);
})

router.get('/group/teacher', verifyAdminOrTeacher, async (req, res) => {
    const teacherId = req.user.id;
    
    try {
        if(req.user.role = 'admin'){
            const groups = await Group.find();  
            return res.status(200).send(groups);
        } else {
            if(req.user.role = 'teacher'){
                const teacherGropusIds = await User.find({_id: teacherId}).select('group_ids');
                const groups = await Group.find({ _id: { $in: teacherGropusIds[0].group_ids } });
                res.status(200).send(groups);
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/group/:id", verifyAdminOrTeacher, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        res.send(group);
    } catch (error) {
        res.send(error);
    }
})

router.post('/group', verifyAdminOrTeacher, checkSchema(groupValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) return res.status(422).send(err);
        
        const data = matchedData(req);
        
        const newId = await generateSequence('group');
        const newData = {
            _id: newId,
            ...data
        }        
        const group = new Group(newData);
        await group.save();
        console.log(group);
        res.send("Group created successfully");
    } catch (error) {
        res.send(error);
    }
})

router.put('/group/:id', verifyAdminOrTeacher, checkSchema(groupValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) return res.status(422).send(err);
        
        const data = matchedData(req);
        const newData = {
            ...data
        }
        const group = await Group.findByIdAndUpdate(req.params.id, newData, { new: true });
        res.send(group);
    } catch (error) {
        res.send(error);
    }
})

router.delete('/group/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router;   