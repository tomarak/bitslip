'use strict';

var request = require('request');
var User = require('../../models/user.server.model.js');

  exports.CoinBaseTokening = function(request, response){


    var split = request.url.split('?code=');
    var code = split[1];
    var username = split[0].split("/user/");
    var callbackurl = "bitslip.herokuapp.com/TODO FILL IN";
    var clientID = 123;
    var clientsecret = 321;

  var coinbaseUrl = "https://www.coinbase.com/oauth/token&grant_type=authorization_code&code="
   + code +
   "&redirect_uri="
   + callbackurl +
   "&client_id=" 
   + clientID + 
   "&client_secret="
   + clientsecret;
//asynchronous calls after this point, must be promised or nested
   request
    .post(coinbaseUrl)
    .on('response', function(response){
      var accessToken = response['access_token'];
      //after we get accessToken from coinbase, query our database
      User.findOne({username: username})
        .exec(function(err, user){
          if(err){
            //do error things
            res.send(404);
          } else {
            //save the users access token
              user.accessToken = accessToken
              user.save();
              res.redirect('/main_page')
            }
        })
    })
  }
