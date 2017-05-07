'use strict';

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var sns = new AWS.SNS();

module.exports.parser = (event, context, callback) => {
  let message = JSON.parse(event.Records[0].Sns.Message);
  let mail = message.mail;

  if (typeof mail === 'undefined') {
    console.error("No email in SNS notification")
    callback(new Error('No email in SNS notification'));
  }


  let receiver = mail.destination[0];
  let atIndex = receiver.indexOf("@");
  let identity = receiver.substring(0, atIndex);
  let sender = mail.source;
  let subject = mail.commonHeaders.subject

  let payload = JSON.stringify({
    receiver: receiver,
    identity: identity,
    sender: sender,
    subject: subject
  });

  sns.publish({
        Message: payload,
        TopicArn: 'arn:aws:sns:us-east-1:633607245587:elFitzChessParsedEmails'
    }, function(err, data) {
        if (err) {
            console.error(err.stack);
            callback(new Error('Failed sending payload to SNS topic'))
            return;
        }
        callback(null, 'Function Finished!');
    });
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
