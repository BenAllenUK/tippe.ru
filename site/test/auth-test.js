var chai = require('chai');
var expect = chai.expect;
var Auth = require('./../src/auth');

describe('Auth', function() {
  it('validatePassword should return false for short passwords', function() {
    expect(Auth.validatePassword('')).to.equal(false);
    expect(Auth.validatePassword('aa')).to.equal(false);
    expect(Auth.validatePassword('12')).to.equal(false);
    expect(Auth.validatePassword('abcdefg')).to.equal(false);
  });

  it('validatePassword should return true for passwords longer than 7 characters', function() {
    expect(Auth.validatePassword('abcdefgh')).to.equal(true);
    expect(Auth.validatePassword('abcdefgh123456789')).to.equal(true);
  });
});
