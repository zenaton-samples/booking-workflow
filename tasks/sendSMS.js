const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports.handle = async function(to, messageTemplate, opts) {
  const body = getSMSTemplate(messageTemplate, opts);

  await client.messages.create({
    body,
    from: "+33611223343",
    to
  });
};

function getSMSTemplate(messageTemplate, opts) {
  let body;
  switch (messageTemplate) {
    case "OWNER_REMINDER":
      body = `You haven't replied yet this booking confirmation`;
      break;

    case "USER_REMINDER":
      body = `Your booking has been confirmed successfully!`;
      break;

    default:
      break;
  }

  return body;
}
