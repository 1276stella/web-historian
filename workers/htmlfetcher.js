// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var crontab = require('node-crontab');

var jobId = crontab.scheduleJob("*/1 * * * *", function(){
  var urls = archive.readListOfUrls(); 
  archive.downloadUrls(urls);  
  console.log('1 minute has passed');
});
