const sendgrid = require("@sendgrid/mail");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.handle = async function(email, templateName, opts) {
  const { body, subject } = getEmailTemplate(templateName, opts);
  await sendgrid.send({
    personalizations: [{ to: [{ email }] }],
    content: [
      {
        type: "text/plain",
        value: body
      }
    ],
    subject: subject,
    from: { email: "zenaton-demo@zenaton.com" }
  });
};

function getEmailTemplate(templateName, opts) {
  let msg;
  switch (templateName) {
    case "REQUEST_TO_OWNER":
      msg = {
        body: "Hey! You have a new reservation,",
        subject: "You have a new reservation!"
      };
      break;

    case "OWNER_CANCELLATION":
      msg = {
        body: "Hey! We're sorry but the owner has canceled the reservation.",
        subject: "Reservation canceled!"
      };
      break;

    case "DEPOSIT_REQUEST":
      msg = {
        body: `Hey! To confirm the booking, we need a deposit of ${opts.deposit_amount} to be made at ${opts.deposit_url}`,
        subject: "Deposit needed!"
      };
      break;

    case "BOOKING_CONFIRMATION":
      msg = {
        body: `Hey! Your booking has been confirmed successfully!`,
        subject: "Booking confirmed!"
      };
      break;

    default:
      break;
  }

  return msg;
}
