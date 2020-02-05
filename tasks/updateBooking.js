const axios = require("axios");
module.exports.handle = async function(booking) {
  // this is a fake task doing an HTTP request on a fake endpoint for the example's sake.
  // in a real project, you should make a request to an endpoint in your application
  await axios.patch("https://httpbin.org/anything/bookings", { body: booking });
};
