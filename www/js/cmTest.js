var appid = "cd6fbde210a9429eaecf45ab61553bf6";
var apikey = "d834bb688831463d8de581eb8130a63f";

cloudmine.init({app_id: appid, api_key: apikey});

cloudmine.setValues({
  one: {
    hello: 'world',
    small: 'worlded'
  },
  two: {
    its: 'not',
    easy: 'being',
    green: '!'
  }
}, function(arg1, arg2) {
  console.error("DEBUG: arg1", arg1);
  console.error("DEBUG: arg2", arg2);
});
