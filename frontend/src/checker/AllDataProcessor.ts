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

    process = (data: ProcessingData) : void => {
        const answersBlock : ProcessedQuestionAnswer[] = []
        const parsedRequest = MainProcessor.parseRequest(data.requestBody)
        const parsedResponse = MainProcessor.parseResponse(data.responseBody)
        if (!parsedResponse) {
            console.error(`Failed to parse response for url ${data.url}`)
            return
        }
        console.debug(`Parsed response: `, parsedResponse.contents)
        const answerChecker = new ProblemHtmlParserImpl(parsedResponse.contents)

        for (let [questionId, answer] of Object.entries(parsedRequest.answers)) {
            const isCorrect = answerChecker.isAnswerCorrect(questionId, answer)
            console.debug(`Answer is correct? ${isCorrect}`)
            if (isCorrect === null) {
                console.error(`Failed to process question ${questionId} with answer ${answer}`)
                return
            }
            answersBlock.push({id: questionId, value: answer, isCorrect})
        }
        this.answersStorage.save(...answersBlock)
    }

    private static parseResponse = (responseBody: string): ProblemCheckResponse | null => {
        try {
            const parsed : ProblemCheckResponse = JSON.parse(responseBody)
            return parsed
        } catch (e) {
            console.error(`Failed to parse response: `, e)
            return null
        }
    }

    private static parseRequest = (requestBody: Record<string, string>): ProblemCheckRequest => {
        // remove [] at the end of key
        const newBody = Object.fromEntries(Object.entries(requestBody).map(([question, answer]) => [question.replace('/\[\]/', ''), answer]))
        console.debug(`Request: `, newBody)
        return {answers: newBody}
    }
}

