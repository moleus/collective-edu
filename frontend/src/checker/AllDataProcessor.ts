import {QuestionStorage} from "./QuestionStorage";
import {ProblemHtmlParserImpl} from "./AnswerChecker";

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
        const answersBlock : ProcessedQuestionAnswer[] = []
        const parsedRequest = this.parseRequest(data.requestBody)
        const parsedResponse = this.parseResponse(data.responseBody)
        const responseHtml = parsedResponse.contensts
        const answerChecker = new ProblemHtmlParserImpl(responseHtml)

        for (let [questionId, answer] of Object.entries(parsedRequest.answers)) {
            const isCorrect = answerChecker.isAnswerCorrect(questionId)
            answersBlock.push({id: questionId, value: answer, isCorrect})
        }
        this.answersStorage.save(...answersBlock)
    }

    private parseResponse(responseBody: string): ProblemCheckResponse {
        return JSON.parse(responseBody) as ProblemCheckResponse
    }

    private parseRequest(requestBody: Record<string, string>): ProblemCheckRequest {
        return {answers: requestBody}
    }
}

