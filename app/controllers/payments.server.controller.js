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
  // console.log(req.user);
  // console.log(req.recipient);
  //accessToken is attached to URL we use the make request
  var coinbaseUrl = 'https://api.coinbase.com/v1/transactions/send_money?access_token='+req.user.accessToken;
  //Standard request format for sending money on Coinbase
  var sendingObject = {
    "transaction": {
      "to": req.recipient.email,
      "amount": req.body.amount,
      "notes": req.body.message
    }
  }
  //not sure if the object above will stringify the variables into string literals, log this
  console.log("Stringified JSON object", JSON.stringify(sendingObject));
  request({
      method: "POST",
      url: coinbaseUrl,
      json: true,
      body: sendingObject
    })
    .on('response', function(response){
      //recieved response is a JSON object
      var receipt = JSON.parse(response);
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
    })
  //Call to Coinbase here.  Req now has senderuser info under req.user and recipient into under req.recipient.  

  next();
};
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
