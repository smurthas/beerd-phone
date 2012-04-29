function ExBeer() {
  cloudmine.init({app_id: window.CONFIG.cloudmine.appid, api_key: window.CONFIG.cloudmine.apikey});

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
    options.chunkedMode = false;
    console.error("DEBUG: options.fileName: " + options.fileName);

    var ft = new FileTransfer();
    //var url = "https://api.cloudmine.me/v1/app/" + window.CONFIG.cloudmine.appid + "/binary/?apikey=" + window.CONFIG.cloudmine.apikey;
    var url = "http://nosslapi.cloudmine.me/v1/app/" + window.CONFIG.cloudmine.appid + "/binary/?apikey=" + window.CONFIG.cloudmine.apikey;
    
    console.log(url);
    ft.upload(fileURI, url, function(success) {
      var uid = JSON.parse(decodeURIComponent(success.response)).key;
      console.error("DEBUG: success, uid: " + uid);
      if(success) return callback(null, 'beer_' + uid);
    }, function(error) {
      if(error) return callback(error);
    }, options);
  }

  var perPage = 50;
  exbeer.getExBeeriences = function(userIDs, callback) {
    var j = 0;
    var arrs = [];
    while (j*perPage < userIDs.length) {
      arrs[j] = userIDs.slice(j*perPage, (j+1) * perPage);
      j++;
    }
    var vals = [];
    // alert("DEBUG: arrs:  " + JSON.stringify(arrs));
    async.forEach(arrs, function(userIDsPage, cb) {
      // console.error("DEBUG: userIDsPage" + userIDsPage.length);
      exbeer.getExBeeriencesPage(userIDsPage, function(err, posts) {
        if (err) return cb(err);
        vals = vals.concat(posts);
        cb();
      });
    }, function(err) {
      vals.sort(function(a, b) {
        if (a.timeStamp < b.timeStamp) return 1;
        if (a.timeStamp > b.timeStamp) return -1;
        return 0;
      });
      callback(null, vals);
    });

  }

  exbeer.getExBeeriencesPage = function(userIDs, callback) {
    var q = '[type="exb"].user[id="' + userIDs.join('" or id="') + '"]';
    cloudmine.search(q, function(result, arg2) {
      if(!result.success) return console.error(result.errors);
      console.log(JSON.stringify(result.success));
      var arr = [];
      result.success.forEach(function(key, value) {
        arr.push(value);
      });
      callback(null, arr);
    });
  }

  exbeer.getImageUrl = function(objectID) {
    return cloudmine.getFileURL(objectID.substring(5), {api_key: window.CONFIG.cloudmine.photoReadKey});
  }

  exbeer.__CLEAR_ALL = function(callback) {
    exbeer.getExBeeriences(function(err, exbs) {
      var keys = [];
      for(var key in exbs) keys.push(key);
      cloudmine.deleteKeys(keys, callback);
    })
  }

  exbeer.favorite = function(objectID, userID, callback) {
    console.log(objectID);
    console.log(userID);
    cloudmine.updateValue(objectID, {
      favorites: {
        __type__: 'op',
        op: 'append_if_unique',
        value: userID
      }
    }, function(result) {
      // console.error("DEBUG: result" + JSON.stringify(result));
      callback();
    });
  }


  exbeer.unfavorite = function(objectID, userID, callback) {
    console.log(objectID);
    console.log(userID);
    cloudmine.updateValue(objectID, {
      favorites: {
        __type__: 'op',
        op: 'remove',
        value: userID
      }
    }, function(result) {
      // console.error("DEBUG: result" + JSON.stringify(result));
      callback();
    });
  }

  return exbeer;
}

function UIDGen() {
  return cloudmine.Base64.encode(Math.random().toString() + Math.random().toString());
}
