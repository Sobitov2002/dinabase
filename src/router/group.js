import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { groupValidation } from "../utils/validation.js";
import { Group } from "../mongoose/schemas/group.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";

const router = Router();

router.get('/group', async (req, res) => {
    const data = await Group.find();
    res.send(data);
})

router.post('/group', checkSchema(groupValidation), async (req, res) => {
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

router.put('/group/:id', checkSchema(groupValidation), async (req, res) => {
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

router.delete('/group/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router;   