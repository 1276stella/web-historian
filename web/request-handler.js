var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
var request = require('request');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log(req.url);
  var statusCode;
  if(req.method === 'GET') {
    console.log("AM I GET");
    statusCode = 200;
    res.writeHead(statusCode,httpHelpers.headers);
    if(req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
        res.end(data);
      });
    } else if(archive.isUrlInList(req.url)) {
      fs.readFile(archive.paths.archivedSites + req.url, function(err, data) {
        res.end(data);
      })
    } else {
      statusCode = 404;
      res.writeHead(statusCode, httpHelpers.headers);
      res.end();
    }
  }
  if(req.method === 'POST') {
    console.log("AM I POST");
    statusCode = 302;
    var body = '';
    req.on('data', function(data) {
      body += data;
    })
    req.on('end', function() {
      var requrl= body.slice(4);
      console.log('requestUrl', requrl);
      if(!archive.isUrlInList(requrl)) {
        archive.addUrlToList(requrl);
        //render loading.html
        fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {
          res.writeHead(statusCode,httpHelpers.headers);
          res.end(data);
        })
        if(!archive.isUrlArchived(requrl)) {
          archive.downloadUrls([requrl]);
          //download the whole page
          request('http://' + requrl, function(error, response, body){
            console.log('error', error);
            console.log('response.statusCode', response.statusCode);

            if(!error && response.statusCode == 200) {
              fs.writeFileSync(archive.paths.archivedSites + '/' + requrl, body);
            }
          })
        }
      } else {
        //render the requested archived page
        fs.readFile(archive.paths.siteAssets + '/' + requrl, function(err, data) {
          res.writeHead(statusCode,httpHelpers.headers);
          res.end(data);
        })
      }
    })
    // res.writeHead(statusCode,httpHelpers.headers);
    // res.end();
  }
 
};
