import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { groupValidation } from "../utils/validation.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import { Section } from "../mongoose/schemas/section.js";
import { Lesson } from "../mongoose/schemas/lesson.js";

const router = Router();

router.get('/lesson-all/:id', verifyAdminOrTeacher,  async (req, res) => {
    try {
        const data = await Lesson.find({sectionId: req.params.id});
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

router.post('/lesson', verifyAdminOrTeacher,  async (req, res) => {
    try {              
        const exsistSection = await Section.findById(req.body.sectionId);
        if(!exsistSection) return res.status(400).send({message: "Bunday section mavjud emas"});
        const position = exsistSection.lessonId.length + 1 
        const newId = await generateSequence('lesson');
        const newData = {        
            _id: newId,
            position: position,
            ...req.body
        }        
        const lesson = new Lesson(newData);
        await lesson.save();
        exsistSection.lessonId.push(newId);
        await exsistSection.save();
        const allLessons = await Lesson.find({sectionId: req.body.sectionId});
        res.send(allLessons);
    } catch (error) {
        res.send(error);
    }
})

// router.put('/lesson-title/:id', verifyAdminOrTeacher, async (req, res) => {
//     try {
//         const err = validationResult(req);
//         if (!err.isEmpty()) return res.status(422).send(err);
        
//         const { title } = matchedData(req);
//         const section = await Section.findByIdAndUpdate(req.params.id, {title}, { new: true });
//         res.send(section);
//     } catch (error) {
//         res.send(error);
//     }
// })

router.put('/lesson/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) return res.status(422).send(err);
        
        const data = matchedData(req);
        const newData = {
            ...data
        }
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, newData, { new: true });
        res.send(lesson);
    } catch (error) {
        res.send(error);
    }
})

router.delete('/lesson/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        const exsistSection = await Section.findById(lesson.sectionId);
        if(!exsistSection) return res.status(400).send({message: "Bunday section mavjud emas"});
        exsistSection.lessonId = exsistSection.lessonId.filter(item => item != req.params.id);
        await exsistSection.save();
        const lessons = await Lesson.find({sectionId: lesson.sectionId});
        res.send(lessons);
    } catch (error) {
        res.send("Something went wrong by deleting lesson", error);
    }
})

export default router;   