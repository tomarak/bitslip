'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  payments = require('../../app/controllers/payments.server.controller');

module.exports = function(app) {
  // payment Routes
  app.route('/payments')
    .get(payments.list)
    .post(users.requiresLogin, users.userByUsername, payments.paymentAPIcall, payments.create);

    //rout to show individual payment.  Middleware converts senderId and recipientId into usernames
  app.route('/payments/:paymentId')
    .get(users.senderByID, users.recipientByID, payments.read);
    // .put(users.requiresLogin, payments.hasAuthorization, payments.update)
    // .delete(users.requiresLogin, payments.hasAuthorization, payments.delete);

  // Finish by binding the payment middleware
  app.param('paymentId', payments.paymentByID);
};
