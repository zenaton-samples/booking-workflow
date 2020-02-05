const { WebClient } = require("@slack/web-api");

const slack = new WebClient(process.env.SLACK_TOKEN);

module.exports.handle = async function(text) {
  await slack.chat.postMessage({
    text,
    channel: process.env.SLACK_CHANNEL
  });
};
