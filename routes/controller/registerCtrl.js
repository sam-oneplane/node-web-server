

const userDB = {
    users: require('../../data/users.json'),
    setUsers: function(data) { this.users = data },
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body ;
    if (!(user && pwd)) {
        return res.status(400).json({'message': 'uname and pwd are required'});
    } 
    // check for duplicate users
    const duplicate = userDB.users.find(p => p.username === user);
    if (duplicate) return res.status(409).send('Conflict');
    try{
        // handle pwd using bcrypt
        const hashPwd = await bcrypt.hash(pwd, 10); // salt 10 rounds
        const newUser = {
            "username": user,
            "roles": {"User": 2001},
            "password": hashPwd, // hashPwd does not work for mac ios 10.13
        };
        userDB.setUsers([...userDB.users, newUser]);
        // write to DB 
        await fsPromises.writeFile(
            path.join(__dirname, '..', '..', 'data', 'users.json'),
            JSON.stringify(userDB.users),
        ); 
        res.status(201).json({'success': `user ${user} created`});
    }catch(err) {
        res.status(500).json({'message': err.message});
    }  
}

module.exports = { handleNewUser} ;