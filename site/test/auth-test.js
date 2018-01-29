var chai = require('chai');
var expect = chai.expect;
var Auth = require('./../src/auth');

before(function()
{
  require('dotenv').config({path:  __dirname + '/../.env'});
});

describe('Auth', function()
{
  it('validatePassword should return false for short passwords', function()
  {
    expect(Auth.validatePassword('')).to.equal(false);
    expect(Auth.validatePassword('aa')).to.equal(false);
    expect(Auth.validatePassword('12')).to.equal(false);
    expect(Auth.validatePassword('abcdefg')).to.equal(false);
  });

  it('validatePassword should return true for passwords longer than 7 characters', function()
  {
    expect(Auth.validatePassword('abcdefgh')).to.equal(true);
    expect(Auth.validatePassword('abcdefgh123456789')).to.equal(true);
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
});
