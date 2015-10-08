var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
var request = require('request');
var html = require('../workers/htmlfetcher.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log(req.url);
  var statusCode;
  if(req.method === 'GET') {
    getter(req, res);
  }
  if(req.method === 'POST') {
    poster(req, res);
  }
 
};

var getter = function(req, res) {
  console.log("AM I GET"); 
  var statusCode = 200;
  res.writeHead(statusCode,httpHelpers.headers);
  if(req.url === '/') {
    fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
      res.end(data);
    });
  } else if(archive.isUrlArchived(req.url.slice(1))) {
    fs.readFile(archive.paths.archivedSites + req.url, function(err, data) {
      res.end(data);
    })
  } else {
    statusCode = 404;
    res.writeHead(statusCode, httpHelpers.headers);
    res.end();
  }
};

var poster = function(req, res) {
  console.log("AM I POST");
  statusCode = 302;
  res.writeHead(statusCode,httpHelpers.headers); 
  var body = '';
  req.on('data', function(data) {
    body += data;
  })

  req.on('end', function() {
    var requrl= body.slice(4);
      console.log('Am I in list?', archive.isUrlInList(requrl));
      console.log('Am I archived?', archive.isUrlArchived(requrl));

    // if the url is not in the list
    if(!archive.isUrlInList(requrl)) {
      archive.addUrlToList(requrl);
      //render loading.html after it is added to the list
      fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {  
        res.end(data);
      })
    } else { // if the url is in the list
      // if the url is archived
      if(archive.isUrlArchived(requrl)) {
        fs.readFile(archive.paths.archivedSites + '/' + requrl, function(err, data) {
          res.end(data);
        })
      } else { // if the url is not archived
        var urls = archive.readListOfUrls(); 
          console.log('urls', urls);
        archive.downloadUrls(urls);
        //render loading page if it is not archived.
        fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {  
          res.end(data);
        })
      }
    }
  })
};