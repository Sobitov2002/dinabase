import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { paymentValidation } from "../utils/validation.js";
import { verifyAdminOrTeacher } from "../utils/verifyAdminOrTeacher.js";
import { Payment } from "../mongoose/schemas/payment.js";
import { generateSequence } from "../utils/sequenceGenerator.js";

const router = Router();

router.post('/payment', async (req, res) => {
    const groupId = 1;
})

router.post('/payment/create', checkSchema(paymentValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const { body } = req;
        const newId = await generateSequence('payment');
        const newData = {
            _id: newId,
            ...body
        }
        
        const payment = new Payment(newData);
        await payment.save();
        res.send(payment);
    } catch (error) {
        res.status(500).send(error);
    }
})

export default router