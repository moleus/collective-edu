import {QuestionStorage} from "./QuestionStorage";
import {ProblemHtmlParserImpl} from "./AnswerChecker";
import {components} from "./apiSchema";

interface ProcessingData {
    url: string;
    requestBody: Record<string, string[]>;
    responseBody: string;
}

interface ProblemCheckRequestProcessor {
    process(data: ProcessingData): void
}

export type ProcessedQuestionAnswer = components['schemas']['ProblemSolution']

export class MainProcessor implements ProblemCheckRequestProcessor {
    constructor(private answersStorage: QuestionStorage) {
    }

    process = async (data: ProcessingData) => {
        const answersBlock: ProcessedQuestionAnswer[] = []
        const parsedRequest = MainProcessor.parseRequest(data.requestBody)
        const parsedResponse = MainProcessor.parseResponse(data.responseBody)
        if (!parsedResponse) {
            console.error(`Failed to parse response for url ${data.url}`)
            return
        }
        console.debug(`Parsed response: `, parsedResponse.contents)
        const answerChecker = new ProblemHtmlParserImpl(parsedResponse.contents)

        for (let [questionId, answers] of parsedRequest.answers) {
            const isCorrect = answers.every(a =>  answerChecker.isAnswerCorrect(questionId, a))
            console.debug(`Answer is correct? ${isCorrect}`)
            if (isCorrect === null) {
                console.error(`Failed to process question ${questionId} with answers ${answers}`)
                return
            }
            answersBlock.push({taskId: questionId, solution: answers, isCorrect})
        }
        await this.answersStorage.save(...answersBlock)
    }

    private static parseResponse = (responseBody: string): ProblemCheckResponse | null => {
        try {
            return JSON.parse(responseBody)
        } catch (e) {
            console.error(`Failed to parse response: `, e)
            return null
        }
    }

    private static parseRequest = (requestBody: Record<string, string[]>): ProblemCheckRequest => {
        // remove [] at the end of key
        let newBody: Map<QuestionId, QuestionAnswer[]> = new Map<QuestionId, QuestionAnswer[]>()
        for (let [question, answer] of Object.entries(requestBody)) {
            let key = question.replace('/\[\]/', '');
            if (newBody.get(key) === undefined) {
                newBody.set(key, answer)
            } else {
                newBody.get(key)?.push(answer[0])
            }
        }
        console.debug(`Request: `, newBody)
        return {answers: newBody}
    }
}

