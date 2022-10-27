
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../model/User');

const handleLogin = async (req, res) => {

    const cookies = req.cookies ;
    console.log(`cookies at login: ${JSON.stringify(cookies)}`);
    const {user, pwd} = req.body ;
    if (!(user && pwd)) {
        return res.status(400).json({'message': 'uname and pwd are required'});
    }
    const foundUser = await User.findOne({ username: user }).exec();

    if (!foundUser) return res.sendStatus(401);
    // eval password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWT - JSON web token for foundUser
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                'UserInfo': {
                    'username': foundUser.username,
                    'roles': roles
                }   
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '20s'}
        );
        const newRefreshToken = jwt.sign(
            {'username': foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        let newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : 
                foundUser.refreshToken.filter(rt => rt != cookies.jwt);
        // clear old cookie
        if (cookies?.jwt) {

            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // reuse in token detected clear refresh token array
            if(!foundToken) {
                newRefreshTokenArray = [] ;
            }
            res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
        }
        // update current user with refresh token
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

        const result = await foundUser.save();
        console.log(result);
        
        // send accessToken as a http cookie witch is not visible to js
        res.cookie('jwt', newRefreshToken, 
            {httpOnly: true, maxAge: 1000*60*60*24, sameSite: 'None'}); //secure: true
        res.json({accessToken});

    }else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };