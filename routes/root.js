
const express = require('express');
const router = express.Router();
const path = require('path');


router.get('^/$|/index(.html)?', (req, res) => {
    //res.send('still here');
    //res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})

// 
router.get('/hello(.html)?', (req, res, next) => {
    console.log('attempt to load hello page');
    next();    
}, (req, res) => {
    res.send('fuck you it is working!');
})


// handlers middleware chain
const shit = (req, res, next) => {
    console.log('attempt to load shit');
    next();
}
const fuck = (req, res) => {
    console.log('attempt to load fuck');
    res.send('Done!');
}
// chain function using next()
router.get('/chain(.html)?', [shit, fuck]);

module.exports = router;
