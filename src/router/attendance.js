import { Router } from "express";
import { attendValidation } from '../utils/validation.js'
import { checkSchema, matchedData  } from "express-validator";
import { Attendance } from '../mongoose/schemas/attendance.js'

const router = Router();

router.post('/attendance', async (req, res) => {
    const attendanceRecords = req.body;
    try {
        for(const record of attendanceRecords){
            Attendance.updateOne(
                { student_id: record.student_id },
                { $set: { status: record.status }},
                { upset: true }
            )
        }
        res.status(200).send({message: "Davomat muvaffaqqiyatli olindi"})
    } catch (error) {
        res.send("Davomat olishda hatolik yuz berdi");
    }
})

export default router;