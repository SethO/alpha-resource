const expect = require('chai').expect;

describe('When running tests', () => {
  it('should know A is A', () => {
    return expect('A').to.equal('A');
  });
});
