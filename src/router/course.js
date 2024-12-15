import { Router } from "express";
import { Course } from "../mongoose/schemas/course.js";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
const router = Router();


router.post('/course/create', async (req, res) => {
    try {
        const courseData = req.body;
        const data = await Course.create(courseData); 
        res.status(201).send({message: "Kurs muvaffaqqiyatli yaratildi"});
    } catch (error) {
        res.status(500).send({message: "Kurs yaratishda hatolik yuz berdi"});
    }
})

export default router;