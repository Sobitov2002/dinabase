import { Router } from "express";

const router = Router();

router.get('/payment', (req, res) => {
    res.send('Welcome to payment panel');
})

router.post('/payment', (req, res) => {
    try {
        
    } catch (error) {
        
    }
})

export default router