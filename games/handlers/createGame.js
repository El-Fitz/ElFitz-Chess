'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.createGames = (event, context, callback) => {
  const timestamp = new Date().getTime();

  let message = JSON.parse(event.Records[0].Sns.Message);

  let receiver = message.receiver;
  let identity = message.identity;
  let player1 = {
    emailAddress: message.sender
  };
  let player2 = {
    emailAddress: message.subject
  };

  if (typeof receiver !== 'string' || typeof identity !== 'string'
  || typeof sender !== 'string' || typeof subject !== 'string') {
    console.error('Validation Failed');
    callback(new Error("Coudln't create the chess game"));
    return
  }

  if (validateEmail(player2.emailAddress) == false) {
    console.error('Player2 is invalid');
    callback(new Error("Coudln't create the chess game"));
    return
  }

  let startingPlayer = Math.floor(Math.random() * 2);

  const params = {
    TableName: 'ElFitzChessGames',
    Item: {
      id: uuid.v1(),
      players: [player1, player2],
      startingPlayer: startingPlayer,
      started: false,
      finished: false,
      undo: false,
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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
