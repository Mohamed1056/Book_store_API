import jsonwebtoken from 'jsonwebtoken';

const authnicatToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null) {
        return res.status(401).json({ message: "Authoriaztion required" });
    }

    jsonwebtoken.verify(token, "bookstore123", (err, user) => {
        if (err){
            return res.status(403).json({ message: "Token expired, please sign in again" });
        }
        req.user = user;
        next();
    });
};

export default authnicatToken;