// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('../web/http-helpers');
var fs = require('fs');
var request = require('request');

// var urls = archive.readListOfUrls(); 
// archive.downloadUrls(urls);