'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  request = require('request'),
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
  //Standard request format for sending money on Coinbase
  var sendingObject = {
    'transaction': {
      'to': req.recipient.email,
      'amount': req.body.amount,
      'notes': req.body.message
    }
  };

  var jsonSend = JSON.stringify(sendingObject, 
    function(key, value){
      return value;
    });

  //not sure if the object above will stringify the variables into string literals, log this
  request.post({
    url: 'https://api.sandbox.coinbase.com/v1/transactions/send_money?access_token=' + req.user.accessToken,
    body: jsonSend
    }, function(error, response, body){
      //recieved response is a JSON object

      console.log(response.body)
      // var receipt = JSON.parse(response);

      var receipt = JSON.parse(response);
      restores receipt variable
      next();
    });
      //example receipt, do what you want with the data
      //{
      //   "success": true,
      //   "transaction": {
      //     "id": "501a1791f8182b2071000087",
      //     "created_at": "2012-08-01T23:00:49-07:00",
      //     "hsh": "9d6a7d1112c3db9de5315b421a5153d71413f5f752aff75bf504b77df4e646a3",
      //     "notes": "Sample transaction for you!",
      //     "idem": "",
      //     "amount": {
      //       "amount": "-1.23400000",
      //       "currency": "BTC"
      //     },
      //     "request": false,
      //     "status": "pending",
      //     "sender": {
      //       "id": "5011f33df8182b142400000e",
      //       "name": "User Two",
      //       "email": "user2@example.com"
      //     },
      //     "recipient": {
      //       "id": "5011f33df8182b142400000a",
      //       "name": "User One",
      //       "email": "user1@example.com"
      //     },
      //     "recipient_address": "37muSN5ZrukVTvyVh3mT5Zc5ew9L9CBare"
      //   }
      // }
};
/**
 * Show the current payment with sender name and recipient name
 */

exports.read = function(req, res) {
  var response = {
    amount: req.payment.amount,
    recipient: req.payment.recipient,
    sender: req.payment.sender,
    created: req.payment.created
  };

  res.json(response);
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
 * List of payments.  Populate converts sendId and recipientId to usernames.
    The argument passed to find limits the results to payments made BY the user currently signed in
    or made TO the user currently signed in.
 */
exports.list = function(req, res) {
  Payment.find({ $or: [{recipientId: req.user._id}, {sendId: req.user._id}]}).sort('-created').populate('sendId', 'username').populate('recipientId', 'username').exec(function(err, payments) {
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
