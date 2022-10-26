

const User = require('../../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body ;
    if (!(user && pwd)) {
        return res.status(400).json({'message': 'uname and pwd are required'});
    } 
    // check for duplicate users ; use exec replace the callback function 
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.status(409).send('Conflict');

    try{
        // handle pwd using bcrypt
        const hashPwd = await bcrypt.hash(pwd, 10); // salt 10 rounds
        /*
        const result = await User.create({
            "username": user,
            "password": hashPwd, // hashPwd does not work for mac ios 10.13
        });
        */
        const newUser = new User({
            "username": user,
            "password": hashPwd,
        });
        const result = await newUser.save();
        console.log(result);
        res.status(201).json({'success': `user ${user} created`});

    }catch(err) {
        res.status(500).json({'message': err.message});
    }  
}

module.exports = { handleNewUser} ;