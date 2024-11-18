import { Router } from "express";
import { checkSchema, matchedData  } from "express-validator";
import { Attendance } from '../mongoose/schemas/attendance.js'
import { generateSequence } from '../utils/sequenceGenerator.js';
import { User } from '../mongoose/schemas/user.js';
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";

const router = Router();

// group_id, date bo'yicha olish
router.post('/attendance/group', verifyAdminOrTeacher, async (req, res) => {
    const { group_id, date } = req.body;

    try {
        const students = await User.find({ role: 'student', group_ids: { $in: [group_id] } }); 

        const attendanceRecords = await Promise.all(students.map(async (student) => {
            console.log(student);
            
            // Tanlangan sanada mavjud yozuvni qidirish
            let attendance = await Attendance.findOne({ date: date, group_id: group_id });

            if (!attendance) {
                attendance = { 
                    status: false, 
                    homework: false,
                    date: date,
                    student_id: student._id, 
                    group_id: group_id,
                    is_active: false
                };
            }

            return {
                student_id: student._id,
                first_name: student.first_name,
                last_name: student.last_name,
                attendance
            };
        }));

        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ error: 'Davomat ma\'lumotlarini olishda xatolik yuz berdi.' });
    }
});

// barchasi
router.get('/attendance', async (req, res) => {
    try {
        const data = await Attendance.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
})

// update
router.post('/attendance/update', async (req, res) => {
    const attendanceRecords = req.body;
    
    try {
        for(const record of attendanceRecords){
            await Attendance.updateOne(
                { student_id: record.student_id, role: record.role },
                { $set: { status: record.status }},
                { upset: true }
            )
        }

        res.status(200).send({message: "Davomat muvaffaqqiyatli saqlandi"});
    } catch (error) {
        res.status(500).send("Davomat olishda hatolik yuz berdi");
    }
})

// create
router.post('/attendance/create', async (req, res) => {
    const attendanceRecords = req.body;
    try {
        if(attendanceRecords[0].is_active) {
            for(const record of attendanceRecords){
                await Attendance.updateOne(
                    { student_id: record.student_id, group_id: record.group_id },
                    { $set: { ...record } },
                    { upset: true }
                );
            }
        } else {
            for(const record of attendanceRecords){
                const newId = await generateSequence('attendance');
                const newData = {
                    _id: newId,
                    ...record
                }
                newData.is_active = true;
                today = new Date();
                newData.date = today.slice(0, 10);
                
                // const attendance = new Attendance(newData);
                // await attendance.save();

                res.status(200).send(newData);
            }
        }

        // res.status(200).send({message: "Davomat muvaffaqqiyatli saqlandi"});
    } catch (error) {
        res.status(500).send({message: "Davomat olishda hatolik yuz berdi"});
    }
})

// delete all
router.delete('/attendance/delete', async (req, res) => {
    try {
        const data = await Attendance.deleteMany();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send("malumot o'chmadi")
                
    }
})

export default router;
