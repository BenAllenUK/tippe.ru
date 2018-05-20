var chai = require('chai');
var expect = chai.expect;

const exec = require ( 'child_process' ).exec;
const vnu = require ( 'vnu-jar' );
var path = require("path");

function runVNU(cmd, callback)
{
  // Work with vnu.jar
  // for example get vnu.jar version
  exec( `java -jar ${vnu} ` + cmd, callback);
}

describe('HTML', function()
{
  var cssFiles = ['./site/public/stylesheets/style.css'];

  describe('css files should be valid', function() {
    cssFiles.forEach(function(file) {
      it(file, function(done) {
        this.timeout(5000);
        runVNU('--css ' + path.resolve(file), function(err, stdout) {
          if (err) done(new Error(err));
          else done();
        });

      });
    });
  });

  describe('generated html files should be valid', function() {
    runVNU('--version');
  });
});
