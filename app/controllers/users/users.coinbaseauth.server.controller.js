// 'use strict';

var request = require('request');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// exports.coinbaseCheckToken = function(req, res){
//   User.findOne({username: username})
//     .exec(function(err, user){
//       if(user.accessToken){
//         res.redirect('/payments')
//       } else {
//         res.redirect("https://www.coinbase.com/oauth/authorize?response_type=code&client_id=db0e75d4c1b0b7a2d22c2927280dc9ffcb478b904ee1b6d1df54d1c43f2cd4dc&redirect_uri=https://bitslip.herokuapp.com/cbredirect&scope=balance+send+transactions+user+reports") 
//       }
//   })
// }

  exports.getCoinbaseToken = function(req, res){    

    //split separates the url into 2 pieces, the route in array position 0,
    //the code string in the array position 1

    var splitUrl = req.url.split('?code=');
    var code = splitUrl[1];
    var username = req.user
    var callbackurl = "https://bitslip.herokuapp.com/payments";
    var clientID = "db0e75d4c1b0b7a2d22c2927280dc9ffcb478b904ee1b6d1df54d1c43f2cd4dc";
    var clientsecret = "c478402035bda0930dcd0ecdad28fdc70ca69a3981a44fa9b5a02bb1207a614d";

    var coinbaseUrl = "https://www.coinbase.com/oauth/token&grant_type=authorization_code&code="
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
              res.redirect('/payments')
            }
        })
    })
  }

