
const userDB = {
    users: require('../../data/users.json'),
    setUsers: function(data) { this.users = data },
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body ;
    if (!(user && pwd)) {
        return res.status(400).json({'message': 'uname and pwd are required'});
    }

    const foundUser = userDB.users.find(p => p.username === user);
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
            {expiresIn: '60s'}
        );
        const refreshToken = jwt.sign(
            {'username': foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );
        // update current user with refresh token
        const otherUsers = userDB.users.filter(u => u.username != foundUser.username);
        const currentUser =  {...foundUser, refreshToken};
        userDB.setUsers([...otherUsers, currentUser]);
        // write new user with refresh token to db
        await fsPromises.writeFile(
            path.join(__dirname, '..', '..', 'data', 'users.json'),
            JSON.stringify(userDB.users)
        );
        // send accessToken as a http cookie witch is not visible to js
        res.cookie('jwt', refreshToken, 
            {httpOnly: true, maxAge: 1000*60*60*24, sameSite: 'None', secure: true});
        res.json({accessToken});

    }else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };