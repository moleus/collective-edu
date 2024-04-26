import browser from "webextension-polyfill";

const openeduProblemCheckUrls: string[] = ["https://courses.openedu.ru/courses/*/problem_check"];


const interceptRequest = (details: browser.WebRequest.OnBeforeRequestDetailsType) => {
    onRequest
    details.requestBody
    console.log("Request URL: " + details.url);
};

browser.webRequest.onBeforeRequest.addListener(
    interceptRequest,
    { urls: openeduProblemCheckUrls },
    ["requestBody"]
);

const interceptResponse = (details: browser.WebRequest.OnCompletedDetailsType) => {
    console.log("Response URL: " + details.url);
    console.log("Response status: " + details.statusCode);
}

// Add listener to intercept responses
browser.webRequest.onCompleted.addListener(
    interceptResponse,
    { urls: openeduProblemCheckUrls }
);


const parseResponse = (body: string): OpenEduCheckResponse => {
    return JSON.parse(body) as OpenEduCheckResponse
}

const onRequest

const onResponse = (body: string): void => {
    const data = parseResponse(body);
}

function listener(details: browser.WebRequest.OnBeforeRequestDetailsType) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    filter.ondata = (event: browser.WebRequest.StreamFilterEventData) => {
        let response = decoder.decode(event.data, { stream: true });
        onResponse(response);
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

