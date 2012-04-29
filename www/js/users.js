function Users() {
  cloudmine.init({app_id: window.CONFIG.cloudmine.appid, api_key: window.CONFIG.cloudmine.apikey});

  var users = {};

  users.createUser = function(fbid, name, friends, callback) {
    var user = {
      fbid: fbid,
      name: name,
      following: []
    };
    for(var i in friends) user.following.push(friends[i].id);
    users.setUser(user, callback);
  }

  users.setUser = function(user, callback) {
    var values = {};
    var uid = 'user_' + user.fbid;
    values[uid] = user;
    user.type = 'user';
    // console.error('DEBUG: setUser values ' + JSON.stringify(values));
    cloudmine.setValues(values, function(success) {
      console.log(success);
      window.localStorage.setItem('user', JSON.stringify(user));
      callback(null, user);
    });
  }

  users.getUser = function() {
    return JSON.parse(window.localStorage.getItem('user'));
  }

  users.getAUser = function(fbid, callback) {
    cloudmine.search('[type="user",fbid="' + fbid + '"]', function(result, arg2) {
      if(!result.success) return console.error(result.errors);
      alert(JSON.stringify(result.success));
      var user = result.success[fbid];
      callback(null, user);
    });
  }

  return users;
}