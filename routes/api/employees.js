
const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require('../controller/employeeCtrl');
const roles = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles')


router.route('/')
    .get(controller.getEmployees)
    .post(verifyRoles(roles.Admin, roles.Editor), controller.postEmployee)
    .put(verifyRoles(roles.Admin, roles.Editor),controller.updateEmployee)
    .delete(verifyRoles(roles.Admin),controller.deleteEmployee);

// route with parameter (id)
router.route('/:id').get(controller.getEmployee);

module.exports = router;

