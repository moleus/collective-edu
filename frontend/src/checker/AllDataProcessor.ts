import {privacy} from "webextension-polyfill";
import {QuestionStorage} from "./QuestionStorage";

interface ProcessingData {
    url: string;
    requestBody: Record<string, string>;
    responseBody: string;
}

interface ProblemCheckRequestProcessor {
    process(data: ProcessingData): void
}

export interface ProcessedQuestionAnswer {
    id: QuestionId;
    value: QuestionAnswer;
    isCorrect: boolean;
}

export class MainProcessor implements ProblemCheckRequestProcessor {
    constructor(private answersStorage : QuestionStorage) {}

    process(data: ProcessingData): void {

        this.answersStorage.save(answer)
    }

    private parseResponse(responseBody: string): ProblemCheckResponse {
        return JSON.parse(responseBody) as ProblemCheckResponse
    }

    private parseRequest(requestBody: Record<string, string>): ProblemCheckRequest {
        return {answers: requestBody}
    }
}

