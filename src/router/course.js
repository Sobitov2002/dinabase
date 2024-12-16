import { Router } from "express";
import { Course } from "../mongoose/schemas/course.js";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import generateSequence from "../utils/sequenceGenerator.js";
const router = Router();

router.get('/course', verifyAdminOrTeacher, async (req, res) => {
    try {
        const data = await Course.find(); 
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.post('/course/create', verifyAdminOrTeacher, async (req, res) => {
    try {
        const data = matchedData(req);

        data = {
            _id: await generateSequence('course'),
            ...data
        }

        const courseData = req.body;
        const newCourse = await Course.create(courseData); 
        res.status(201).send({message: "Kurs muvaffaqqiyatli yaratildi", course: newCourse});
    } catch (error) {
        res.status(500).send({message: "Kurs yaratishda hatolik yuz berdi"});
    }
})

export default router;