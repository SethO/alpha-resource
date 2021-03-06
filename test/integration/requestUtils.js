const aws4 = require('aws4');
const isJsonString = require('is-json');
const rp = require('minimal-request-promise');
const url = require('url');


module.exports.makeRequestAsync = ({awsCredentials, requestParams}) => {
  const updatedRequestParams = addUriSettingsToRequestParams(requestParams);
  const signedRequest = signRequest(awsCredentials, updatedRequestParams);

  return rp(signedRequest)
    .then((response) => {
      return isJsonString(response) ? JSON.parse(response) : response;
    });
};

const addUriSettingsToRequestParams = (requestParams) => {
  const updatedRequestParams = requestParams;
  const parsedUrl = url.parse(requestParams.uri);
  updatedRequestParams.host = parsedUrl.host;
  updatedRequestParams.path = parsedUrl.path;
  
  return updatedRequestParams;
};

const signRequest = (awsCredentials, requestParams) => {
  console.log(`signRequest(${JSON.stringify(awsCredentials)}, ${JSON.stringify(requestParams)})`);
  const modifiedRequestParams = Object.assign({}, requestParams);
  const result = aws4.sign(modifiedRequestParams, awsCredentials);
  // console.log(`modifiedRequestParams: ${JSON.stringify(modifiedRequestParams)}`);

  return result;
};
