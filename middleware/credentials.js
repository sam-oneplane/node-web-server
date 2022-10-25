const cors = require('../config/corsOpt');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(cors.whiteList.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials 