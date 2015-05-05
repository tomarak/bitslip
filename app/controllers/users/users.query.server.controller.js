
var mongoose = require('mongoose');
var User = mongoose.model('User');


exports.queryUsers = function(req, res) {
  var regex = new RegExp(req.query["term"], 'i');
  var query = User.find({username: regex}, { 'username': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  var buildResultSet = function(docs){
    var result = [];
    for(var object in docs){
      result.push(docs[object]);
    }
    return result;
   };

  query.exec(function(err, users) {
      if (!err) {
         // Method to construct the json result set
         var result = buildResultSet(users); 
         res.send(result, {
            'Content-Type': 'application/json'
         }, 200);
                
      } else {
         res.send(JSON.stringify(err), {
            'Content-Type': 'application/json'
         }, 404);
      }
   });

};
