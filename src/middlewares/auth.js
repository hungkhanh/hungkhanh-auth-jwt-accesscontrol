import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.sendStatus(401);
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.locals.username = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(403).end();
    }
}

module.exports = verifyToken;