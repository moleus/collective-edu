const openeduProblemCheckUrls = ["https://courses.openedu.ru/courses/*/problem_check"];

const interceptRequest = async (details) => {
    console.log("Request URL: " + details.url);
};

browser.webRequest.onBeforeRequest.addListener(
    interceptRequest,
    { urls: openeduProblemCheckUrls }
);

// Add listener to intercept responses
browser.webRequest.onCompleted.addListener(
    interceptResponse,
    { urls: openeduProblemCheckUrls }
);

function interceptResponse(details) {
    console.log("Response URL: " + details.url);
    console.log("Response status: " + details.statusCode);
}

let filter = browser.webRequest.filterResponseData(details.requestId);
filter.ondata = (event) => {
    console.log(`filter.ondata received ${event.data.byteLength} bytes`);
    filter.write(event.data);
};
filter.onstop = (event) => {
    // The extension should always call filter.close() or filter.disconnect()
    // after creating the StreamFilter, otherwise the response is kept alive forever.
    // If processing of the response data is finished, use close. If any remaining
    // response data should be processed by Firefox, use disconnect.
    filter.close();
};

function listener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    filter.ondata = (event) => {
        let response = decoder.decode(event.data, { stream: true });
        console.log(`Response content: ${response}`);
        filter.write(encoder.encode(response));
        filter.disconnect();
    };

    return {};
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: openeduProblemCheckUrls, types: ["main_frame"] },
    ["blocking"],
);

