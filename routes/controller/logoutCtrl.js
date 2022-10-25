const userDB = {
    users: require('../../data/users.json'),
    setUsers: function(data) { this.users = data },
}

const fsPromises = require('fs').promises;
const path = require('path');


const handleLogout = async (req, res) => {

    // on client delete the accessToken as well

    const cookies = req.cookies ;
    if (!cookies?.jwt) { // chain if not cookies and not jwt
        return res.sendStatus(204); // no content to send
    }
    // if cookie exists extract refresh token from jwt
    const refreshToken = cookies.jwt;
     
    const foundUser = userDB.users.find(p => p.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
        return res.sendStatus(204); 
    } 

    // delete refreshToken in db
    const otherUsers = userDB.users.filter(u => u.refreshToken != foundUser.refreshToken);
    // clear current user refreshToken from userDB
    const currentUser = {...foundUser, refreshToken: ''};
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', '..', 'data', 'users.json'),
        JSON.stringify(userDB.users)
    );
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