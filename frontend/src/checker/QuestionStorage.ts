import {ProcessedQuestionAnswer} from "./AllDataProcessor";

export interface QuestionStorage {
    save(answer: ProcessedQuestionAnswer): void;
    get(id: QuestionId): ProcessedQuestionAnswer[];
}

export class LocalStorage implements QuestionStorage {
    private answers: ProcessedQuestionAnswer[] = []

    save(answer: ProcessedQuestionAnswer): void {
        this.answers.push(answer);
    }
    get(id: string): ProcessedQuestionAnswer[] {
        return this.answers.filter((e) => e.id == id);
    }
}

