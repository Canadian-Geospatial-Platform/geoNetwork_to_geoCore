var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = async (event) => {

function getS3Objects(bucket,key){
    return s3.getObject({
      Bucket:'dev-geocore-transform-input-1',
      Key:'f511dd05-2890-469a-9331-29a615b59761.geojson',
      ResponseContentType:'application/json'})
               .promise().then(file=>{return file})
               .catch(error =>{return error});
}

//  var transform = require("node-json-transform").transform;
  // or
//  var { transform } = require("node-json-transform");

//  var result = transform({
//    text: "hello",
//    night: "Day"
//  }, {
//    item: {
//      message: "text",
//      time: "night"
//    }
//  });

    // TODO implement
//    const response = {
//        statusCode: 200,
//        body: result,
//    };
//   return response;
};
