require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOpt = require('./config/corsOpt');
const registers = require('./routes/controller/registerCtrl');
const verifyJwt = require('./middleware/verifyJWT');
const refresh = require('./routes/api/refresh');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;


// connect to mongoDB
connectDB();

/*
    middleware : anything between request and response
    1. build in
    2. custom
    3. 3rd party
*/
// custom middleware logger
app.use(logger);

app.use(credentials);
// cross origin resource sharing
app.use(cors(corsOpt));

// handle url encoded data (form data as parameter)
// 'content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended : false}));

// build in for json            
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve for static files in public folder : css , image, text 
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('^/', require('./routes/root'));

// new user registration and authentication
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));
app.use(verifyJwt);
app.use('/employees', require('./routes/api/employees'));



// default
app.all('*', (req, res) => {
    // change status to 404    
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

// custom error middleware 
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
