exports.handler = async (event) => {

  var transform = require("node-json-transform").transform;
  // or
  var { transform } = require("node-json-transform");

  var result = transform({
    text: "hello"
  }, {
    item: {
      message: "text"
    }
  });

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
    };
    return response;
};
