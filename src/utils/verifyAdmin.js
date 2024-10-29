import jwt from 'jsonwebtoken';


const JWT_SECRET = 'isThereAnotherOne';

export function verifyAdmin(req, res, next) {
    const token = (req.headers['authorization'] || '').split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        if (decoded.role === 'admin') {
            next(); 
        } else {
            return res.status(403).send({ message: 'Forbidden' });
        }
    });
}