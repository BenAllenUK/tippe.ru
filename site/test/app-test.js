// set of integration tests for the main server app
describe('Integration', function()
{
  it('Server starts up and shuts down gracefully', function()
  {
    this.slow(400);

    var server = require('../www');
    server.close();
  });
});
