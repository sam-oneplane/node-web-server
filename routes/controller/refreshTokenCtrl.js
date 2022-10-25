const userDB = {
    users: require('../../data/users.json'),
    setUsers: function(data) { this.users = data },
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {

    const cookies = req.cookies ;
    if (!cookies?.jwt) { // chain if not cookies and not jwt
        return res.sendStatus(401);
    }
    // if cookie exists extract refresh token from jwt
    const refreshToken = cookies.jwt;
     
    const foundUser = userDB.users.find(p => p.refreshToken === refreshToken);
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