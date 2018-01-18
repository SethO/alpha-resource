const requestUtils = require('./requestUtils');

class alphaSdk {
  
  constructor(awsAccessKeyId = process.env.ALPHA_API_AWS_ACCESS_KEY_ID,
    awsSecretAccessKey = process.env.ALPHA_API_AWS_SECRET_ACCESS_KEY
  ) {
    this.awsAccessKeyId = awsAccessKeyId;
    this.awsSecretAccessKey = awsSecretAccessKey;
  }

  hello() {
    const awsCredentials = {
      accessKeyId: this.awsAccessKeyId,
      secretAccessKey: this.awsSecretAccessKey
    };
    const requestParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      uri: 'https://sethorell.com/alpha/hello',
      service: 'execute-api'
      // uri: 'https://w8llizht3e.execute-api.us-east-1.amazonaws.com/prod/hello'
    };

    return requestUtils.makeRequestAsync({awsCredentials, requestParams});
  }
}

module.exports = alphaSdk;
