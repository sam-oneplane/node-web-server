const express = require('express');
const router = express.Router() ;
const controller = require("../controller/logoutCtrl");

router.get('/', controller.handleLogout);

module.exports = router;