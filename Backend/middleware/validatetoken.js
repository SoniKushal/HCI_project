const jwt = require('jsonwebtoken');
require('dotenv').config();

const validatetoken = (req, res, next) => {
    //console.log(req.cookies)
    //const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]
    const tk = req.header('Authorization');
    if(!tk)
    {
        return res.status(401).json({ "error": "Unauthorized user" });
    }
    const token = tk.replace("Bearer", "").trim();
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(404).json({ "error": "Unauthorized user" });
            }
            else {
                req.user = decoded;
                next();
            }
        })
    }
    else {
        res.status(404).json({ "error": "Unauthorized user" });
    }

}

module.exports = validatetoken;