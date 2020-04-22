import SNS from "aws-sdk/clients/sns";
import { default as core, IRouterMatcher } from "express-serve-static-core";
import express, {RequestHandler} from "express";

const snsDomain = "http://866b18a3.ngrok.io"; // `${process.env.ROOT_DOMAIN}:${process.env.PORT}`

const snsSubscriptions = [
  {
    Protocol: "http" /* required */,
    TopicArn: process.env.AWS_SNS_TRANSCODE_START!,
    Endpoint: `${snsDomain}/sns/transcode/start`,
  },
  {
    Protocol: "http" /* required */,
    TopicArn: process.env.AWS_SNS_TRANSCODE_COMPLETION!,
    Endpoint: `${snsDomain}/sns/transcode/completion`,
  },
  {
    Protocol: "http" /* required */,
    TopicArn: process.env.AWS_SNS_TRANSCODE_ERROR!,
    Endpoint: `${snsDomain}/sns/transcode/error`,
  },
];

type SnsEndpoint = {
  topic: string;
  path: string;
  handler: RequestHandler;
};
type SnsOptions = {
  domain: string;
  awsRegion: string;
  awsCredentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};

export function installSns(
  app: core.Express,
  endpoints: SnsEndpoint[],
  options: SnsOptions
) {
  const sns = new SNS({
    region: options.awsRegion,
    credentials: options.awsCredentials,
  });

  const confirmationMiddleWare: RequestHandler = async (req, res, next) => {
    req.body = JSON.parse(req.body);
    if (req.headers["x-amz-sns-message-type"] === "SubscriptionConfirmation") {
      await sns
        .confirmSubscription({
          Token: req.body.Token,
          TopicArn: req.body.TopicArn,
        })
        .promise();
      res.sendStatus(200);
      return;
    }
    next();
  };

  const subscriptions = endpoints.map((endpoint) => ({
    Protocol: options.domain.startsWith("https") ? "https" : "http",
    TopicArn: endpoint.topic,
    Endpoint: `${options.domain}${endpoint.path}`,
  }));

  endpoints.forEach((endpoint) => {
    app.post(
      endpoint.path,
      express.text(),
      confirmationMiddleWare,
      endpoint.handler
    );
  });

  Promise.all(subscriptions.map((params) => sns.subscribe(params).promise()))
    .then(() => {
      console.log("successfully subscribed to sns");
    })
    .catch(console.log);
}
