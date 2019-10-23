var request = require('request');
request
  .get('https://icanhazdadjoke.com/')
  .set('Accept', 'application/json')
  .end(function(err, res){
  });
