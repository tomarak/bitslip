
var mongoose = require('mongoose');
var User = mongoose.model('User');


exports.queryUsers = function(req, res) {
  var regex = new RegExp(req.query["term"], 'i');
  var query = User.find({fullname: regex}, { 'fullname': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

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
