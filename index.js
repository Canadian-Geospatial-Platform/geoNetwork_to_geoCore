exports.handler =  async function(event, context) {

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


  console.log(result)
  return result
}
