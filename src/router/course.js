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

router.get('/course/:id', async (req, res) => {
    try {
        const data = await Course.findById(req.params.id); 
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({message: "Kursni topishda hatolik yuz berdi"});
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

router.put('/course/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send({message: "Kurs muvaffaqqiyatli o'zgartirildi"});
    } catch (error) {
        res.status(500).send({message: "Kursni o'zgartirishda hatolik yuz berdi"});
    }
})

router.patch('/course/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const allowedUpdates = ['title', 'description', 'learning', 'requirements', 'level', 'language', 'category', 'oldPrice', 'currentPrice', 'previewImage', 'published'];
      const updateKeys = Object.keys(updates);
      const isValidOperation = updateKeys.every((key) => allowedUpdates.includes(key));
  
      if (!isValidOperation) {
        return res.status(400).send({ message: 'Invalid updates!' });
      }
  
      const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
        new: true, 
        runValidators: true, 
      });
  
      if (!updatedCourse) {
        return res.status(404).send({ message: 'Course not found!' });
      }
  
      res.status(200).send(updatedCourse);
    } catch (error) {
      res.status(500).send({ message: 'Server error', error });
    }
});

router.delete('/course/:id', verifyAdminOrTeacher, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router;