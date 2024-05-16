import {ProcessedQuestionAnswer} from "./AllDataProcessor";
import {QuestionId} from "../types/problemCheck.ts";

const SOLUTIONS_PATH = "http://185.112.102.15:8080/solutions";

export interface QuestionStorage {
    save(...answers: ProcessedQuestionAnswer[]): Promise<void>;

    get(id: QuestionId): Promise<ProcessedQuestionAnswer[]>;

    getMany(ids: QuestionId[]): Promise<ProcessedQuestionAnswer[][]>
}

export class ServerStorage implements QuestionStorage {
    async save(...answers: ProcessedQuestionAnswer[]): Promise<void> {
        console.log("Saving new answers to server", answers);
        let r = await fetch(SOLUTIONS_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answers)
        }).catch((e) => console.error(e));
        return console.log(r);
    }

    async get(id: QuestionId): Promise<ProcessedQuestionAnswer[]> {
        console.log("Getting answers from server");
        return fetch(SOLUTIONS_PATH + `?taskIDs=${id}`).then((r) => r.json()).catch((e) => console.error(e))
    }

    async getMany(ids: string[]): Promise<ProcessedQuestionAnswer[][]> {
        console.log("Getting answers from server for multiple ids");
        const idsParam = ids.join(',');
        return fetch(SOLUTIONS_PATH + `?taskIDs=${idsParam}`)
            .then((r) => r.json())
            .catch((e) => console.error(e));
    }
}
