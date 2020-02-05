// load dependencies
const { workflow, task } = require("zenaton");

// define tasks
task("createBooking", require("./tasks/createBooking"));
task("updateBooking", require("./tasks/updateBooking"));

task("sendEmail", require("./tasks/sendEmail"));
task("sendSlackMessage", require("./tasks/sendSlackMessage"));
task("sendSMS", require("./tasks/sendSMS"));
// define workflows
workflow("bookingWorkflow", require("./workflows/bookingWorkflow"));
