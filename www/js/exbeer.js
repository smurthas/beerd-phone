var appid = "cd6fbde210a9429eaecf45ab61553bf6";
var apikey = "d834bb688831463d8de581eb8130a63f";


function ExBeer() {
  cloudmine.init({app_id: appid, api_key: apikey});

  var exbeer = {};

  exbeer.postExBeerience = function(exb, callback) {
    var values = {};
    values[exb.uid] = exb;
    exb.type = 'exb';
    exb.timeStamp = Date.now();
    console.error("DEBUG: values " + JSON.stringify(values));
    cloudmine.setValues(values, function(success) {
      console.log(success);
      callback(null, uid);
    });
  }

  exbeer.postPhoto = function(fileURI, callback) {
    console.error("DEBUG: fileURI: " + fileURI);
    var options = new FileUploadOptions();
    // this is required, and MUST be "file"
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/')+1);
    // this value will determine what content-type is used
    // when the file is retrieved from CloudMine
    options.mimeType = "image/jpg";
    console.error("DEBUG: options.fileName: " + options.fileName);

    var ft = new FileTransfer();
    var url = "https://api.cloudmine.me/v1/app/" + appid + "/binary/?apikey=" + apikey;
    console.log(url);
    ft.upload(fileURI, url, function(success) {
      var uid = JSON.parse(decodeURIComponent(success.response)).key;
      console.error("DEBUG: success, uid: " + uid);
      if(success) return callback(null, 'beer_' + uid);
    }, function(error) {
      if(error) return callback(error);
    }, options);
  }

  exbeer.getExBeeriences = function(callback) {
    cloudmine.search('[type="exb"]', function(result, arg2) {
      if(!result.success) return console.error(result.errors);
      alert(JSON.stringify(result.success));
      var arr = [];
      result.success.forEach(function(key, value) {
        arr.push(value);
      });
      arr.sort(function(a, b) {
        if (a.timeStamp < b.timeStamp) return 1;
        if (a.timeStamp > b.timeStamp) return -1;
        return 0;
      });
      callback(null, arr);
    });
  }

  exbeer.getImageUrl = function(objectID) {
    return cloudmine.getFileURL(objectID.substring(5));
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