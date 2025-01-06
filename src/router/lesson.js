import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { groupValidation } from "../utils/validation.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import { Section } from "../mongoose/schemas/section.js";
import { Lesson } from "../mongoose/schemas/lesson.js";
import { Progress } from "../mongoose/schemas/progress.js";
import { verifyToken } from "../utils/verifyToken.js";
import { Course } from "../mongoose/schemas/course.js";
import{ getCourseDashboardData} from "./course.js";

const router = Router();

// checknox clicked complete lesson 
router.post('/complete-lesson/:id', verifyToken, async (req, res) => {
    const userProgres = await Progress.findOne({userId: req.userId, lessonId: req.params.id});
    if(userProgres) {
       userProgres.isCompleted = true;
       await userProgres.save(); 
    } else {
        const newId = await generateSequence('progress');
        const newUserProgress = new Progress({
            _id: newId,
            userId: req.userId,
            lessonId: req.params.id,
            isCompleted: true
        })
        const lesson = await Lesson.findById(req.params.id);
        lesson.userProgress.push(newUserProgress._id);

        await lesson.save();
        await newUserProgress.save();
    }
    const data = await getCourseDashboardData(req.body.courseId, req.userId);
    res.send(data);
})

router.post('/uncomplete-lesson/:id', verifyToken, async (req, res) => {
    await Progress.findOneAndDelete({lessonId: req.params.id});
    const data = await getCourseDashboardData(req.body.courseId, req.userId);
    res.send(data);
})

router.get('/lesson-all/:id', verifyAdminOrTeacher,  async (req, res) => {
    try {
        const data = await Lesson.find({sectionId: req.params.id});
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.get('/lesson/:id', verifyToken, async (req, res) => {
    try {
        const data = await Lesson.findById(req.params.id).select('title videoUrl _id');
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({message: "Lessonni topishda hatolik yuz berdi"});
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

router.put('/lesson/:id', verifyAdminOrTeacher, async (req, res) => {
    try {        
        const data = req.body;
        const newData = {
            ...data
        }
        await Lesson.findByIdAndUpdate(req.params.id, newData, { new: true });
        const allLessons = await Lesson.find({sectionId: req.body.sectionId});
        res.send(allLessons);
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