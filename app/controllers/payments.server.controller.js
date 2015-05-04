'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  User = mongoose.model('User'),
  Payment = mongoose.model('Payment'),
  _ = require('lodash');

/**
 * Create a payment
 */
exports.create = function(req, res) {

  var payment = new Payment({
    amount: req.body.amount,
    message: req.body.message,
    sendId: req.user._id,
    recipientId: req.recipient._id

  });
  payment.user = req.user;

  payment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payment);
    }
  });
};

exports.paymentAPIcall = function(req, res, next){

  //Call to Coinbase here.  Req now has senderuser info under req.user and recipient into under req.recipient.  

  next();
}
/**
 * Show the current payment
 */
exports.read = function(req, res) {
  res.json(req.payment);
};

/**
 * Update a payment
 */
exports.update = function(req, res) {
  var payment = req.payment;

  payment = _.extend(payment, req.body);

  payment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payment);
    }
  });
};

/**
 * Delete a payment
 */
exports.delete = function(req, res) {
  var payment = req.payment;

  payment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payment);
    }
  });
};

/**
 * List of payments
 */
exports.list = function(req, res) {
  Payment.find().sort('-created').populate('user', 'displayName').exec(function(err, payments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payments);
    }
  });
};

/**
 * payment middleware
 */
exports.paymentByID = function(req, res, next, id) {
  Payment.findById(id).populate('user', 'displayName').exec(function(err, payment) {
    if (err) return next(err);
    if (!payment) return next(new Error('Failed to load payment ' + id));
    req.payment = payment;
    next();
  });
};

/**
 * payment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.payment.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
