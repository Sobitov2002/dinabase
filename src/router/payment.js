import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { paymentValidation } from "../utils/validation.js";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";

const router = Router();

router.get('/payment', async (req, res) => {
    res.send('Welcome to payment panel');
})

router.post('/payment', checkSchema(paymentValidation), verifyAdminOrTeacher, async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        
    } catch (error) {
        
    }
})

export default router