'use strict';

module.exports.validator = (event, context, callback) => {
  //console.log('Spam filter');

  var sesNotification = event.Records[0].ses;
  console.log("SES Notification:\n", JSON.stringify(sesNotification, null, 2));

  // Check if any spam check failed
  if (sesNotification.receipt.spfVerdict.status === 'FAIL'
  || sesNotification.receipt.dkimVerdict.status === 'FAIL'
  || sesNotification.receipt.spamVerdict.status === 'FAIL'
  || sesNotification.receipt.virusVerdict.status === 'FAIL')
  {
    console.log('Dropping spam');
    // Stop processing rule set, dropping message
    context.succeed({'disposition':'STOP_RULE_SET'});
  }
  else
  {
    context.succeed();
  }
};
