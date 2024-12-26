import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { groupValidation } from "../utils/validation.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import { Section } from "../mongoose/schemas/section.js";

const router = Router();

router.get('/section', verifyAdminOrTeacher,  async (req, res) => {
    try {
        const data = await Section.find(); 
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.get('/section/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const data = await Section.findById(req.params.id); 
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({message: "Sectionni topishda hatolik yuz berdi"});
    }
})

router.post('/section', verifyAdminOrTeacher,  async (req, res) => {
    try {              
        // const data = matchedData(req);
        const sections = await Section.find();
        const newId = await generateSequence('section');
        const newData = {        
            _id: newId,
            position: sections.length + 1,
            ...req.body
        }        
        const section = new Section(newData);
        await section.save();
        const allSections = await Section.find({courseId: req.body.courseId});
        res.send(allSections);
    } catch (error) {
        res.send(error);
    }
})

router.put('/section/:id', verifyAdminOrTeacher, checkSchema(groupValidation), async (req, res) => {
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

router.delete('/section/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        await Section.findByIdAndDelete(req.params.id);
        res.send("Section deleted successfully");
    } catch (error) {
        res.send("Something went wrong by deleting section", error);
    }
})

export default router;   