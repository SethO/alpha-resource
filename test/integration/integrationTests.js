const AlphaSdk = require('./alpha-sdk');
const expect = require('chai').expect;

describe('When hitting the Alpha API', () => {
  it('should return 200', () => {
    // ARRANGE
    const alphaSdk = new AlphaSdk();

    // ACT
    const actPromise = alphaSdk.hello();

    // ASSERT
    return actPromise
      .then(result => expect(result.statusCode).to.equal(200));
  });
});
