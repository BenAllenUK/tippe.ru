var chai = require('chai');
var expect = chai.expect;
var Utils = require('./../src/utils');

describe('Utils', function()
{
  let lengths = [-100,-1,0,1,2,3,4,16,32,64];

  describe('generateRandomString should return the correct length', function() {

    lengths.forEach(function(length) {
      it('len : ' + length, function()
      {
        expect(Utils.generateRandomString(length).length).to.equal(length > -1 ? length : 0);
      });
    });
  });

  describe('generateRandomString returns different values for each call', function() {
    lengths.forEach(function(length) {
      if(length <= 0) return;
      it('len : ' + length, function()
      {
        this.retries(1);
        expect(Utils.generateRandomString(length)).to.not.equal(Utils.generateRandomString(length));
      });
    });
  });
});
