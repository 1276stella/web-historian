var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(func){
  var data = fs.readFileSync(exports.paths.list, 'utf8');
  var result = data.split('\n');
  if(func) {
    func.call(this, result);
  }
  return result;
};

// check if the input url is in site.txt
exports.isUrlInList = function(url, func){
  var result = exports.readListOfUrls();
  var flag = false;
  if(result.indexOf(url) !== -1) {
    flag = true;
  }
  if(func) {
    func.call(this, flag);
  }
  return flag;
};

exports.addUrlToList = function(url, func){
  fs.appendFileSync(exports.paths.list, url + '\n', 'utf8');
  if(func) {
    func.call(this);
  }
};

exports.isUrlArchived = function(url, func){
  fs.readFile(exports.paths.archivedSites + '/' + url, 'utf8', function (err, data) {
    if(err) {
      if(func) {
        func.call(this, false);
      }
      return false;
    } else {
      if(func) {
        func.call(this, true);
      }
      return true;
    }
  });
};

exports.downloadUrls = function(url){
  for(var i = 0; i < url.length; i++) {
    fs.writeFileSync(exports.paths.archivedSites + '/' + url[i], '');
  }
};
