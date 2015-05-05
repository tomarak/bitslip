// 'use strict';

var request = require('request');
var mongoose = require('mongoose');
var User = mongoose.model('User');

  exports.getCoinbaseToken = function(req, res){    

    //split separates the url into 2 pieces, the route in array position 0,
    //the code string in the array position 1

    var splitUrl = req.url.split('?code=');
    var code = splitUrl[1];
    var username = req.user.username;
    var callbackurl = "https://bitslip.herokuapp.com/payments";
    var clientID = "b6372a73732cd26fd06163b4a1ae66a390a4a8793131db27600e4f11568aac9b";
    var clientsecret = "fc1c3ddf529789bb7065adfb238c1ab23410bd705586a309e3af8f2cddcf2165";
    var coinbaseUrl = "https://sandbox.coinbase.com/oauth/token&grant_type=authorization_code&code="
     + code +
     "&redirect_uri="
     + callbackurl +
     "&client_id=" 
     + clientID + 
     "&client_secret="
     + clientsecret

  //asynchronous calls after this point, must be promised or nested
   request
    .post(coinbaseUrl)
    .on('response', function(response){
      console.log("RESPONSE FROM COINBASE WITH ACCESSTOKEN", response.access_token);
      var accessToken = response['access_token'];
      //after we get accessToken from coinbase, query our database
      User.findOne({username: username})
        .exec(function(err, user){
          if(err){
            //do error things
            res.send(404);
          } else {
            //save the users access token
              user.accessToken = accessToken;
              user.save();
              res.redirect('#!/payments')
            }
        })
    })
  }

