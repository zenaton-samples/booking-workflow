const { duration } = require("zenaton");

/* Workflow for an event-booking marketplace with notifications to user, owner's place and customer success team  */
module.exports.handle = function*(booking) {
  this.run.task("sendEmail", booking.owner.email, "REQUEST_TO_OWNER");

  const ownerReplyEvent = yield this.wait
    .event("ownerReplyEvent")
    .for(duration.seconds(15));

  if (ownerReplyEvent) {
    // Get the owner's response from the event's data
    const [_, eventData] = ownerReplyEvent;

    this.bookingConfirmation = eventData;

    if (this.bookingConfirmation.status === "accepted") {
      // Create a booking and save it to the database
      yield this.run.task("createBooking", booking);
    } else {
      // if the owner refused
      // alert the user about the cancellation
      this.run.task("sendEmail", booking.user.email, "OWNER_CANCELLATION");
    }
  } else {
    // if the owner doesn't reply
    // send an SMS reminder
    this.run.task("sendSMS", booking.owner.phone, "OWNER_REMINDER");

    this.run.task(
      "sendSlackMessage",
      `#${booking.id} is waiting for the owner's reply...`
    );

    // stop the workflow execution
    return;
  }

  // if the restaurant requires a deposit
  if (booking.deposit) {
    // send a deposit request email to the user
    this.run.task(
      "sendEmail",
      booking.user.email,
      "DEPOSIT_REQUEST",
      this.bookingConfirmation
    );

    // Notify the customer success team about the deposit request
    this.run.task(
      "sendSlackMessage",
      `#${booking.id} waiting for user deposit...`
    );
  } else {
    // if the restaurant did not require a deposit
    // notify the user via confirmation SMS and email
    this.run.task("sendSMS", booking.owner.user, "USER_REMINDER");

    this.run.task("sendEmail", booking.user.email, "BOOKING_CONFIRMATION");

    // Notify the customer success team about the new booking completion
    this.run.task("sendSlackMessage", `#${booking.id} booking complete.`);
    // Update the booking record in the database
    yield this.run.task("updateBooking", booking);
  }
};
