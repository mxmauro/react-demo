'use strict';

const util = require('util');
const express = require('express');
const BodyParser = require('body-parser');
const MethodOverride = require('method-override');
const Helmet = require('helmet');

const Users = require('./users');

exports.initialize = async function ()
{
	//configure web server
	let app = express();
	app.use(BodyParser.json({ limit: 'npm in5mb' }));
	app.use(BodyParser.urlencoded({ extended: false, limit: '5mb' }));
	app.use(MethodOverride());
	app.use(Helmet());
	app.disable('x-powered-by');
	app.set('trust proxy', 1);

	var router = express.Router();
	router.route('/users/login').post(Users.login);
	/*
	router.route('/employees/resendconfirmation').post(employeeController.resendConfirmationEmail);
	router.route('/employees/confirm').get(employeeController.confirmEmail);
	router.route('/employees/changepassword').post(employeeController.changePassword);
	router.route('/employees/sendpasswordrecovery').post(employeeController.sendPasswordRecoveryEmail);
	router.route('/employees/recoverpassword').post(employeeController.recoverPassword);

	router.route('/employees/createedit').post(employeeController.createedit);
	router.route('/employees/delete').post(employeeController.delete);
	router.route('/employees/get/:id').get(employeeController.get);
	router.route('/employees/datatable').post(employeeController.getForDataTables);
	router.route('/employees/getlist').post(employeeController.getList);

	router.route('/projects/createedit').post(projectController.createedit);
	router.route('/projects/delete').post(projectController.delete);
	router.route('/projects/get/:id').get(projectController.get);
	router.route('/projects/datatable').post(projectController.getForDataTables);

	router.route('/projects_assignments/createedit').post(projectAssignmentController.createedit);
	router.route('/projects_assignments/delete').post(projectAssignmentController.delete);
	router.route('/projects_assignments/get/:id').get(projectAssignmentController.get);
	router.route('/projects_assignments/chart').post(projectAssignmentController.getForChart);
	*/
	app.use('/api', router);
	app.use(function(req, res, next) {
		res.status(404).send('Not found!');
	});

	//start web server
	app.listen(config.webserver.port);

	return;
}
