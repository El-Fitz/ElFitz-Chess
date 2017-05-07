'use strict';

module.exports.dispatcher = (event, context, callback) => {

  console.log("Received event: ", event);
  let message = JSON.parse(event.Records[0].Sns.Message);

  let receiver = message.receiver;
  let identity = message.identity;
  let sender = message.sender;
  let subject = message.subject;
  let identities = process.env.identities;

  var snsArn = identities["identity"];

  if (typeof snsArn === 'undefined') {
    snsArn = "arn:aws:sns:us-east-1:633607245587:elFitzChessExistingGame"
  }

  sns.publish({
        Message: event.Records[0].Sns.Message,
        TopicArn: snsArn
    }, function(err, data) {
        if (err) {
            console.error(err.stack);
            callback(new Error('Failed sending payload to SNS topic'))
            return;
        }
        callback(null, 'Function Finished!');
    });
  console.log("Message: ", message);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
