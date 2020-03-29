var AWS = require('aws-sdk');

var s3 = new AWS.S3({
  apiVersion: '2012–09–25'
});

var eltr = new AWS.ElasticTranscoder({
  apiVersion: '2012–09–25',
  region: process.env.REGION
});

function removeExtension(srcKey){
  let lastDotPosition = srcKey.lastIndexOf(".");
  if (lastDotPosition === -1) return srcKey;
  return srcKey.substr(0, lastDotPosition);
}

exports.handler = function (event, context) {
  console.log('Executing Elastic Transcoder Orchestrator');
  var bucket = event.Records[0].s3.bucket.name;
  var key = event.Records[0].s3.object.key;
  if (bucket !== process.env.INPUT_BUCKET) {
    context.fail('Incorrect Input Bucket');
    return;
  }
  var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); //the object may have spaces
  var newKey = removeExtension(srcKey);
  var params = {
    PipelineId: process.env.PIPELINE_ID,
    Input: {
      Key: srcKey,
      FrameRate: 'auto',
      Resolution: 'auto',
      AspectRatio: 'auto',
      Interlaced: 'auto',
      Container: 'auto'
    },
    Outputs: [{
      Key: `${newKey}.mp3`,
      PresetId: '1351620000001-300020', // mp3 192kbs
    }]
  };
  console.log('Starting Job');
  eltr.createJob(params, function (err, data) {
    if (err) {
      console.log(err);
      return context.fail('Job creation failed');
    } else {
      console.log(data);
    }
    context.succeed('Job well done');
  });
}
  ;
