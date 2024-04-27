import {ProcessedQuestionAnswer} from "./AllDataProcessor";

const SOLUTIONS_PATH = "http://127.0.0.1:8080/solutions";

export interface QuestionStorage {
    save(...answers: ProcessedQuestionAnswer[]): Promise<void>;

    get(id: QuestionId): Promise<ProcessedQuestionAnswer[]>;
}

export class LocalStorage implements QuestionStorage {
    private readonly answers: ProcessedQuestionAnswer[] = []
    private localStorageKey: string = 'openEduAnswers'; // Key to store answers in local storage

    constructor() {
        const storedAnswers = localStorage.getItem(this.localStorageKey);
        if (storedAnswers) {
            this.answers = JSON.parse(storedAnswers);
        }
    }

    save(answers: ProcessedQuestionAnswer): Promise<void> {
        console.log("Saving new answers");
        this.answers.push(answers);
        this.saveToLocalStorage();
        return Promise.resolve();
    }

    async get(id: string): Promise<ProcessedQuestionAnswer[]> {
        return this.answers.filter((e) => e.taskId == id);
    }

    private saveToLocalStorage(): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.answers));
    }
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
        return fetch(SOLUTIONS_PATH + `?id=${id}`).then((r) => r.json()).catch((e) => console.error(e))
    }
}