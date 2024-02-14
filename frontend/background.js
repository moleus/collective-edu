// Function to intercept requests
const interceptRequest = async (details) => {
  console.log("Request URL: " + details.url);
};

// Function to intercept responses
const interceptResponse = async (details) => {
  const response = await fetch(details.url);
  const responseBody = await response.text();
  console.log("Response body: " + responseBody);
};

// Add listener to intercept requests
// browser.webRequest.onBeforeRequest.addListener(
//   interceptRequest,
//   { urls: ["https://courses.openedu.ru/courses/*/problem_check"] },
//   ["requestBody"]
// );
browser.webRequest.onBeforeRequest.addListener(
  interceptRequest,
  { urls: ["https://apps.openedu.ru/*"] },
  ["requestBody"]
);

// Add listener to intercept responses
browser.webRequest.onCompleted.addListener(
  interceptResponse,
  { urls: ["https://courses.openedu.ru/courses/*/problem_check"] },
  ["responseBody"]
);

function logURL(requestDetails) {
  console.log(`Loading: ${requestDetails.url}`);
}

browser.webRequest.onBeforeRequest.addListener(logURL, {
  urls: ["<all_urls>"],
});


// // match pattern for the URLs to redirect
// let pattern = "https://developer.mozilla.org/*";

// // URL we will redirect to
// let redirectUrl =
//   "https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif";

// // redirect function returns a Promise
// // which is resolved with the redirect URL when a timer expires
// function redirectAsync(requestDetails) {
//   console.log(`Redirecting async: ${requestDetails.url}`);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({ redirectUrl });
//     }, 2000);
//   });
// }

// // add the listener,
// // passing the filter argument and "blocking"
// browser.webRequest.onBeforeRequest.addListener(
//   redirectAsync,
//   { urls: [pattern], types: ["image"] },
//   ["blocking"],
// );
