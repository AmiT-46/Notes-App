const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload)=>{
        if(err || !payload?.sub) return res.sendStatus(401);
        req.userId = payload.sub;
        next();
    });
}

function createAccessToken(userId) {
    return jwt.sign(
        { sub: userId.toString() },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
}

module.exports = {
    authenticateToken,
    createAccessToken,
}

