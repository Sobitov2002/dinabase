import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { adminValidation } from "../utils/validation.js";
import { generateSequence } from '../utils/sequenceGenerator.js';
import { hashPassword } from "../utils/hashPassword.js";
import { Admin } from "../mongoose/schemas/admin.js";
const router = Router();

router.get('/admin', (req, res) => {
    res.send('Welcome to admin panel');
})

router.post('/admin', checkSchema(adminValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        data.password = await hashPassword(data.password);
        const newId = await generateSequence('admin');
        const newData = {
            _id: newId,
            ...data
        }
        const admin = new Admin(newData);
        await admin.save();
        res.send(admin);
    } catch (error) {
        res.send(error);
    }
})

router.put('/admin/:id', checkSchema(adminValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        data.password = await hashPassword(data.password);
        const newData = {
            ...data
        }
        const admin = await Admin.findByIdAndUpdate(req.params.id, newData, { new: true });
        res.send(admin);
    } catch (error) {
        res.send(error);
    }
})

router.delete('/admin/:id', async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        res.send("Data deleted successfully");
    } catch (error) {
        res.send(error);
    }
})

export default router;