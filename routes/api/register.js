const express = require('express');
const router = express.Router() ;
const controller = require("../controller/registerCtrl");

router.post('/', controller.handleNewUser);


module.exports = router;