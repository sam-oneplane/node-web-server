
const jwt = require('jsonwebtoken');
const User = require('../../model/User');

const handleRefreshToken = async (req, res) => {

    const cookies = req.cookies ;
    if (!cookies?.jwt) { // chain if not cookies and not jwt
        return res.sendStatus(401); // no cookie
    }
    // if cookie exists extract refresh token from jwt
    const refreshToken = cookies.jwt;
    // remove cookie after token extraction
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    // search for user holding the refresh token
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

    // refresh token reuse here:
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decode) => {
                if (err) return res.sendStatus(403); // err found - expire token 
                console.log('refresh token reuse')
                const hackedUser = await User.findOne({username: decode.username}).exec();
                // empty refresh token array of the found User and then save
                hackedUser.refreshToken = [];
                const result = hackedUser.save();
                console.log(result);
            }
        )
        return res.sendStatus(403); // 
    }

    // user found create a new refresh token array
    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt != refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decode) => {

            if (err) {
                console.log('expire refresh token')
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result);
            }

            if(err || foundUser.username !== decode.username) return res.sendStatus(403) ;

            // refresh token still valid
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        'username': decode.username,
                        'roles': roles
                    },   
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '20s'}
            );

            const newRefreshToken = jwt.sign(
                {'username': foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '1d'}
            );
            
            // update current user with refresh token
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();
            
            // send a cookie
            res.cookie('jwt', newRefreshToken,  {httpOnly: true, maxAge: 1000*60*60*24, sameSite: 'None'}); //secure: true

            // send access token
            res.json({roles, accessToken})
        }
    )
                
}

module.exports = { handleRefreshToken }