import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';

dotenv.config();

export async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorized request');
        }
        
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('Access token required');
        }

        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        if (!payload?.id) {
            return res.status(403).send('Invalid token payload');
        }
        
        req.userId = payload.id
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(400).send('Token verification error')
    }
}