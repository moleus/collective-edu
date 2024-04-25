const openeduProblemCheckUrls: string[] = ["https://courses.openedu.ru/courses/*/problem_check"];

const interceptRequest = (details: browser.webRequest._OnBeforeRequestDetails) => {
    console.log("Request URL: " + details.url);
};

browser.webRequest.onBeforeRequest.addListener(
    interceptRequest,
    { urls: openeduProblemCheckUrls }
);

const interceptResponse = (details: browser.webRequest._OnCompletedDetails) => {
    console.log("Response URL: " + details.url);
    console.log("Response status: " + details.statusCode);
}

// Add listener to intercept responses
browser.webRequest.onCompleted.addListener(
    interceptResponse,
    { urls: openeduProblemCheckUrls }
);

interface OpenEduCheckResponse {
    status: string;
    message: string;
}

function listener(details: browser.webRequest._OnBeforeRequestDetails) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    filter.ondata = (event: browser.webRequest._StreamFilterOndataEvent) => {
        let response = decoder.decode(event.data, { stream: true });
        console.log(`Response content: ${response}`);
        filter.write(encoder.encode(response));
        filter.disconnect();
    };

    return {};
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: openeduProblemCheckUrls},
    ["blocking"],
);

