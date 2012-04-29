var appid = "cd6fbde210a9429eaecf45ab61553bf6";
var apikey = "d834bb688831463d8de581eb8130a63f";


function Users() {
  cloudmine.init({app_id: appid, api_key: apikey});

  var users = {};

  users.createUser = function(fbid, name, callback) {
    var user = {
      fbid: fbid,
      name: name,
      following: []
    };
    users.setUser(users, callback);
  }

  users.setUser = function(user, callback) {
    var values = {};
    var uid = 'user_' + user.fbid;
    values[uid] = user;
    user.type = 'user';
    console.error('DEBUG: setUser values ' + JSON.stringify(values));
    cloudmine.setValues(values, function(success) {
      console.log(success);
      callback(null, user);
    });
  }

  users.getUser = function(fbid, callback) {
    cloudmine.search('[type="user",fbid="' + fbid + '"]', function(result, arg2) {
      if(!result.success) return console.error(result.errors);
      alert(JSON.stringify(result.success));
      var user = result.success[fbid];
      callback(null, user);
    });
  }

  return users;
}