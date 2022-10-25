const express = require('express');
const router = express.Router() ;
const controller = require("../controller/authCtrl");

router.post('/', controller.handleLogin);


module.exports = router;