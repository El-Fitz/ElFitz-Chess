'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.userEmail !== 'string') {
    console.error('Validation Failed');
    callback(new Error("Coudln't create the todo item"));
    return
  }

  let userEmail

  const params = {
    TableName: 'todos',
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }

  dynamoDB.put(params, function(error, result) {
    if (error) {
      console.error(error);
      callback(new Error("Couldn't create the todo item"));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    }
    callback(null, response);
  });
}
