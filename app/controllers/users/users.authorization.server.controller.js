'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

//Convert payment senderId into sender username

exports.senderByID = function(req, res, next) {
	User.findOne({
		_id: req.payment.sendId
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.payment.sender = user.username;
		next();
	});
};

//Convert payment recipientId into recipient username

exports.recipientByID = function(req, res, next) {
	User.findOne({
		_id: req.payment.recipientId
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.payment.recipient = user.username;
		next();
	});
};




exports.userByUsername = function(req, res, next){	
	var username = req.body.recipient;
	User.findOne({
		username: username
	}).exec(function(err, user){
		if(err)return next(err);
		if(!user) return next(new Error('Failed to load User with username ' + username));
		req.recipient = user;
		next();
	});
};
/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};