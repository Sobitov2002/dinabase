import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { loginValidation } from "../utils/validation.js";
import { User } from "../mongoose/schemas/user.js";
import { comparePassword } from "../utils/hashPassword.js";
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = 'isThereAnotherOne';

router.post('/auth/login', checkSchema(loginValidation), async (req, res) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(422).send(err);
        }
        const data = matchedData(req);
        const user = await User.findOne({login: data.login});
        console.log(user);
        
        if (!user) return res.status(404).send('User not found');
        if (!await comparePassword(data.password, user.password)) return res.status(401).send('Wrong password');
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);

        res.send({auth: true, token: token, role: user.role});
    } catch (error) {
        res.send(error);
    }
})

export default router