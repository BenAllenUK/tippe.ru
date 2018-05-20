var chai = require('chai');
var expect = chai.expect;

const exec = require ( 'child_process' ).exec;
const vnu = require ( 'vnu-jar' );
var path = require("path");

describe('HTML', function()
{
  var cssFiles = ['./site/public/stylesheets/style.css'];

  describe('css files should be valid', function() {
    cssFiles.forEach(function(file) {
      it(file, function(done) {
        this.timeout(15000);
        exec( `java -jar ${vnu} --css ` + path.resolve(file), function(err, stdout) {
          if (err) done(new Error(err));
          else done();
        });

      });
    });
  });

  var queryPaths = ['/', '/logout'];

  describe('generated html files should be valid', function() {
    var server;
    var serverAddr;
    before(function () {
      server = require('../www');
      serverAddr = 'http://localhost:' + server.getWebserver().address().port;
    });

    after(function () {
      server.close();
    });

    queryPaths.forEach(function(path) {
      it(path, function(done) {
        this.timeout(15000);
        console.log(`java -jar ${vnu} ${serverAddr}${path}`);
        exec( `java -jar ${vnu} ${serverAddr}${path}`, function(err, stdout) {
          if (err) done(new Error(err));
          else done();
        });
      });
    });
  });
});
