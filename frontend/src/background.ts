import browser from "webextension-polyfill";
import {ServerStorage} from "./checker/QuestionStorage";
import {MainProcessor} from "./checker/AllDataProcessor";

const openeduProblemCheckUrls: string[] = ["https://courses.openedu.ru/courses/*/problem_check"];
const globalServerStorage = new ServerStorage()
const globalDataProbcessor = new MainProcessor(globalServerStorage)

function listener(details: browser.WebRequest.OnBeforeRequestDetailsType) {
    const url = details.url
    const requestBody = details.requestBody?.formData as Record<string, string[]> | undefined

    const filter = browser.webRequest.filterResponseData(details.requestId);
    const encoder = new TextEncoder();

    const data : ArrayBuffer[] = []
    filter.ondata = (event: browser.WebRequest.StreamFilterEventData) => {
        data.push(event.data)
    };

    filter.onstop = async () => {
        const blob = new Blob(data, { type: "application/json" });
        let responseBody = await blob.text();
        if (!requestBody) {
            console.log(`Request body is undefined for url: '${url}'. Skipping`)
        } else {
            await globalDataProbcessor.process({url, requestBody, responseBody})
        }
        filter.write(encoder.encode(responseBody));
        filter.disconnect();
    }
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: openeduProblemCheckUrls},
    ["blocking", "requestBody"],
);