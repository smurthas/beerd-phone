var appid = "cd6fbde210a9429eaecf45ab61553bf6";
var apikey = "d834bb688831463d8de581eb8130a63f";


function ExBeer() {
  cloudmine.init({app_id: appid, api_key: apikey});

  var exbeer = {};

  exbeer.postExBeerience = function(exb, callback) {
    var values = {};
    var uid = UIDGen();
    values[uid] = exb;
    cloudmine.setValues(values, function(success) {
      console.log(success);
      callback(null, values);
    });
  }

  exbeer.getExBeeriences = function(callback) {
    cloudmine.getValues(null, function(success) {
      if(!success) return console.error(success);
      var objs = {};
      success.forEach(function(key, value) {
        objs[key] = value;
      });
      callback(null, objs);
    });
  }

  exbeer.__CLEAR_ALL = function(callback) {
    exbeer.getExBeeriences(function(err, exbs) {
      var keys = [];
      for(var key in exbs) keys.push(key);
      cloudmine.deleteKeys(keys, callback);
    })
  }

  return exbeer;
}

function UIDGen() {
  return cloudmine.Base64.encode(Math.random().toString() + Math.random().toString());
}