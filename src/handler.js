module.exports.helloWorld = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.25! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};