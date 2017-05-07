'use strict';


module.exports.get = (event, context, callback) => {

  const params = {
    TableName: "ElFitzChessGames",
    Key: {
      id: event.gameID
    }
  };

  /*dynamoDB.get(params, function(error, result) {
    if (error) {
      console.error(error);
      callback(new Error("Couldn't fetch the todo item"));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
    callback(null, response);
  })*/
}
