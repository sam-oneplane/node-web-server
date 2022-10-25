const express = require('express');
const router = express.Router() ;
const controller = require("../controller/refreshTokenCtrl");

router.get('/', controller.handleRefreshToken);

module.exports = router;