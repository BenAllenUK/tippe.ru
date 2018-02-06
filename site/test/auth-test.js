var chai = require('chai');
var expect = chai.expect;
var Auth = require('./../src/auth');

before(function()
{
  require('dotenv').config({path:  __dirname + '/../.env'});
});

// data
var validPasswords = ["helloWorld", "123456789", "a1b2c3d4e5", "abcdefgh", "abcdefgh123456789"];
var invalidPasswords = ["h", "", "123456"];
var passwordSalts = ['yr820hodn', '2u90d2hd2', 'dh2d0h201', '19s1d9010'];

describe('Auth', function()
{
  describe('validatePassword should return false for invalid passwords', function()
  {
     invalidPasswords.forEach(function(item) {
       it(item, function() {
         expect(Auth.validatePassword(item)).to.equal(false);
      });
    });
  });

  describe('validatePassword should return true for valid passwords', function()
  {
    validPasswords.forEach(function(item) {
      if(item, function() {
        expect(Auth.validatePassword(item)).to.equal(true);
      });
    });
  });

  it('generateAccessToken should return different tokens for different parameters', function()
  {
    expect(Auth.generateAccessToken('userID', 1517251117)).to.not.equal(Auth.generateAccessToken('userID', 1517251119));
    expect(Auth.generateAccessToken('userID1', 1517251114)).to.not.equal(Auth.generateAccessToken('userID2', 1517251114));
    expect(Auth.generateAccessToken('userID', -100000)).to.not.equal(Auth.generateAccessToken('userID', 1517251117));
    expect(Auth.generateAccessToken('userID1', -1517251117)).to.not.equal(Auth.generateAccessToken('userID2', -1517251117));
  });

  it('validateAccessToken should return false for expired tokens', function()
  {
    expect(Auth.validateAccessToken(Auth.generateAccessToken('userID', 0))).to.equal(false);
    expect(Auth.validateAccessToken(Auth.generateAccessToken('userID', 1))).to.equal(false);
    expect(Auth.validateAccessToken(Auth.generateAccessToken('userID', 1517251117))).to.equal(false);
    expect(Auth.validateAccessToken(Auth.generateAccessToken('userID', -10))).to.equal(false);
    expect(Auth.validateAccessToken(Auth.generateAccessToken('userID', -1517251117))).to.equal(false);
  });

  it('validateAccessToken should return true for valid tokens', function()
  {
    var curUnixTime = Math.round((new Date()).getTime() / 1000);

    expect(Auth.validateAccessToken(Auth.generateAccessToken('userID', curUnixTime + 1))).to.equal(true);
    expect(Auth.validateAccessToken(Auth.generateAccessToken('userID', curUnixTime + (60 * 60)))).to.equal(true);
  });

  it('validateAccessTokenForUser should return false for other users tokens', function()
  {
    var curUnixTime = Math.round((new Date()).getTime() / 1000);
    var userID1 = 'userID';
    var userID2 = 'otherUserID';

    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID1, curUnixTime + 1),          userID2)).to.equal(false);
    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID1, curUnixTime + (60 * 60)),  userID2)).to.equal(false);
    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID1, 0),                        userID2)).to.equal(false);
    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID1, -1517251117),              userID2)).to.equal(false);

    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID2, curUnixTime + 1),          userID1)).to.equal(false);
    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID2, curUnixTime + (60 * 60)),  userID1)).to.equal(false);
    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID2, 0),                        userID1)).to.equal(false);
    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID2, -1517251117),              userID1)).to.equal(false);
  });

  it('validateAccessTokenForUser should return true for correct users tokens', function()
  {
    var curUnixTime = Math.round((new Date()).getTime() / 1000);
    var userID1 = 'userID';
    var userID2 = 'otherUserID';

    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID1, curUnixTime + 1),          userID1)).to.equal(true);
    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID1, curUnixTime + (60 * 60)),  userID1)).to.equal(true);

    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID2, curUnixTime + 1),          userID2)).to.equal(true);
    expect(Auth.validateAccessTokenForUser(Auth.generateAccessToken(userID2, curUnixTime + (60 * 60)),  userID2)).to.equal(true);
  });

  describe('checkPassword should return true for matching passwords', function()
  {
    let salt = '123abc';
    validPasswords.forEach(function(item) {
      it(item, function()  {
        expect(Auth.checkPassword(item, Auth.hashPassword(item, salt), salt)).to.equal(true);
      });
    });
  });

  describe('checkPassword should return false for invalid passwords', function()
  {
    let salt = '123abc';
    invalidPasswords.forEach(function(item) {
      it(item, function() {
        expect(Auth.checkPassword(item, Auth.hashPassword(item, salt), salt)).to.equal(false);
      });
    });
  });

  describe('hashPassword', function()
  {
    let inputs = validPasswords.concat(invalidPasswords);

    describe('hashPassword should not return the same value for different inputs', function()
    {
      inputs.forEach(function(item1,index1) {
        inputs.forEach(function(item2,index2) {
          passwordSalts.forEach(function(salt) {
            if(index1 == index2) return;

            it(item1 + " != " + item2, function() {
              expect(Auth.hashPassword(item1, salt)).not.to.equal(Auth.hashPassword(item2, salt));
            });
          });
        });
      });
    });

    describe('hashPassword should not return the same as the password itself', function()
    {
      inputs.forEach(function(item) {
        passwordSalts.forEach(function(salt) {
          it(item, function() {
            expect(Auth.hashPassword(item, salt)).not.to.equal(item);
          });
        });
      });
    });

    describe('hashPassword should be deterministic', function()
    {
      inputs.forEach(function(item) {
        it(item, function() {
          passwordSalts.forEach(function(salt) {
            expect(Auth.hashPassword(item, salt)).to.equal(Auth.hashPassword(item, salt));
          });
        });
      });
    });

    describe('hashPassword should return different values for differen salts', function()
    {
      passwordSalts.forEach(function(salt1, index1) {
        passwordSalts.forEach(function(salt2, index2) {
          if(index1 == index2) return;

          it(salt1 + " != " + salt2, function() {
            inputs.forEach(function(item) {
              expect(Auth.hashPassword(item, salt1)).to.not.equal(Auth.hashPassword(item, salt2));
            });
          });
        });
      });
    });
  });
});
