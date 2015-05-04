'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Payment Schema
 */ 
 /**
  sender UID
  recipient UID
  Amount
  message
  Date
**/
var PaymentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    default: '',
    trim: true,
    required: 'Amount cannot be blank'
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  sendId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  recipientId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    default: 'pending'
    //CB provides "pending" or "complete".  
  }
});

mongoose.model('Payment', PaymentSchema);
