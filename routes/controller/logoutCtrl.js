const User = require('../../model/User');


const handleLogout = async (req, res) => {

    // on client delete the accessToken as well

    const cookies = req.cookies ;
    if (!cookies?.jwt) { // chain if not cookies and not jwt
        return res.sendStatus(204); // no content to send
    }
    // if cookie exists extract refresh token from jwt
    const refreshToken = cookies.jwt;
     
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
        return res.sendStatus(204); 
    } 

    foundUser.refreshToken = '';
    const result = await foundUser.save(); // save empty user in database like deleting
    console.log(result);

    res.clearCookie(
        'jwt', 
        {
            httpOnly: true, 
            sameSite: 'None',
            secure: true
        },
    );  //secure: true   serve only https 
    res.sendStatus(204);
}

module.exports = { handleLogout }