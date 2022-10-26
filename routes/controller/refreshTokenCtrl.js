
const jwt = require('jsonwebtoken');
const User = require('../../model/User');

const handleRefreshToken = async (req, res) => {

    const cookies = req.cookies ;
    if (!cookies?.jwt) { // chain if not cookies and not jwt
        return res.sendStatus(401);
    }
    // if cookie exists extract refresh token from jwt
    const refreshToken = cookies.jwt;
     
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); // 
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decode) => {
            if(err || foundUser.username !== decode.username) return res,sendStatus(403) ;
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        'username': decode.username,
                        'roles': roles
                    },   
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            // send access token
            res.json({accessToken})
        }
    )
                
}

module.exports = { handleRefreshToken }