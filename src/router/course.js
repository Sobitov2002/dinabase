import { Router } from "express";
import { Course } from "../mongoose/schemas/course.js";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import { generateSequence } from "../utils/sequenceGenerator.js";
const router = Router();

router.get('/course', verifyAdminOrTeacher, async (req, res) => {
    try {
        const data = await Course.find(); 
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.post('/course/create', verifyAdminOrTeacher,  async (req, res) => {
    try {
        const newData = {
            _id: await generateSequence('course'),
            ...req.body
        }

        const course = new Course(newData); 
        const newCourse = await course.save();
        res.status(201).send({message: "Kurs muvaffaqqiyatli yaratildi" });
    } catch (error) {
        console.log(error);
        
        res.status(500).send({message: "Kurs yaratishda hatolik yuz berdi"});
    }
})

export default router;