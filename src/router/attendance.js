import { Router } from "express";
import { checkSchema, matchedData  } from "express-validator";
import { Attendance } from '../mongoose/schemas/attendance.js'
import { generateSequence } from '../utils/sequenceGenerator.js';

const router = Router();

router.post('/attendance/group', async (req, res) => {
    const groupId = 2;
    const day = '02.10.2024';
    try {
        const data = await Attendance.find({ group_id: groupId, data: day });
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/attendance', async (req, res) => {
    try {
        const data = await Attendance.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/attendance', async (req, res) => {
    const attendanceRecords = req.body;
    
    try {
        for(const record of attendanceRecords){
            const newId = await generateSequence('attendance');
            const newData = {
                _id: newId,
                ...record
            }
            console.log(newData);
            
            const attendance = new Attendance(newData);
            await attendance.save();
        }

        res.status(200).send({message: "Davomat muvaffaqqiyatli saqlandi"});
    } catch (error) {
        res.status(500).send("Davomat olishda hatolik yuz berdi");
    }
})


// outer.post('/attendance', async (req, res) => {
//     const attendanceRecords = req.body;
    
//     try {
//         for(const record of attendanceRecords){
//             await Attendance.updateOne(
//                 { student_id: record.student_id, role: record.role },
//                 { $set: { status: record.status }},
//                 { upset: true }
//             )
//         }

//         res.status(200).send({message: "Davomat muvaffaqqiyatli saqlandi"});
//     } catch (error) {
//         res.status(500).send("Davomat olishda hatolik yuz berdi");
//     }
// })

export default router;