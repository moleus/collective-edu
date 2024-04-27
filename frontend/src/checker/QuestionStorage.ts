import {ProcessedQuestionAnswer} from "./AllDataProcessor";

export interface QuestionStorage {
    save(...answers: ProcessedQuestionAnswer[]): void;
    get(id: QuestionId): ProcessedQuestionAnswer[];
}

export class LocalStorage implements QuestionStorage {
    private answers: ProcessedQuestionAnswer[] = []
    private localStorageKey: string = 'openEduAnswers'; // Key to store answers in local storage

    constructor() {
        const storedAnswers = localStorage.getItem(this.localStorageKey);
        if (storedAnswers) {
            this.answers = JSON.parse(storedAnswers);
        }
    }

    save(answers: ProcessedQuestionAnswer): void {
        console.log("Saving new answers");
        this.answers.push(answers);
        this.saveToLocalStorage();
    }

    get(id: string): ProcessedQuestionAnswer[] {
        return this.answers.filter((e) => e.id == id);
    }

    private saveToLocalStorage(): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.answers));
    }
}
