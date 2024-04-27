import browser from "webextension-polyfill";
import {LocalStorage} from "./checker/QuestionStorage";
import {MainProcessor} from "./checker/AllDataProcessor";

const openeduProblemCheckUrls: string[] = ["https://courses.openedu.ru/courses/*/problem_check"];
const globalLocalStorage = new LocalStorage()
const globalDataProbcessor = new MainProcessor(globalLocalStorage)

function listener(details: browser.WebRequest.OnBeforeRequestDetailsType) {
    const url = details.url
    const requestBody = details.requestBody?.formData

    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();

    filter.ondata = (event: browser.WebRequest.StreamFilterEventData) => {
        let responseBody = decoder.decode(event.data, { stream: true });
        if (!requestBody) {
            console.log(`Request body is undefined for url: '${url}'. Skipping`)
        } else {
            globalDataProbcessor.process({url, requestBody, responseBody})
        }
        filter.write(encoder.encode(responseBody));
        filter.disconnect();
    };

    return {};
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: openeduProblemCheckUrls},
    ["blocking", "requestBody"],
);
