var chai = require('chai');
var expect = chai.expect;
var Utils = require('./../helpers/utils');

describe('Utils', function()
{
  let lengths = [-100,-1,0,1,2,3,4,16,32,64];

  let validEmails = ["email@domain.com", "firstname.lastname@domain.com", "email@subdomain.domain.com", "firstname+lastname@domain.com"/*, "email@123.123.123.123"*/, "email@[123.123.123.123]",
    "1234567890@domain.com", "email@domain-one.com", "_______@domain.com", "email@domain.name", "email@domain.co.jp", "firstname-lastname@domain.com", "firstname.lastname17@domain.com",
  "あいうえお@domain.com"];
  let invalidEmails = ["", "plainaddress", "#@%^%#$@#$@#.com", "@domain.com", "Joe Smith <email@domain.com>", "email.domain.com", "email@domain@domain.com",
    "email@domain.com (Joe Smith)", "email@domain", "email@111.222.333.44444", "email@domain..com"];

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

  describe('validateEmail returns true for valid emails', function() {
    validEmails.forEach(function(email) {
      it(email, function()
      {
        expect(Utils.isValidEmail(email)).to.equal(true);
      });
    });
  });

  describe('validateEmail returns false for invalid emails', function() {
    invalidEmails.forEach(function(email) {
      it(email, function()
      {
        expect(Utils.isValidEmail(email)).to.equal(false);
      });
    });
  });
});
