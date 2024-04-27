import {ProcessedQuestionAnswer} from "./AllDataProcessor";

export interface QuestionStorage {
    save(...answers: ProcessedQuestionAnswer[]): void;
    get(id: QuestionId): ProcessedQuestionAnswer[];
}

export class LocalStorage implements QuestionStorage {
    private answers: ProcessedQuestionAnswer[] = []

    save(answers: ProcessedQuestionAnswer): void {
        console.log("Saving new answers");
        this.answers.push(answers);
    }
    get(id: string): ProcessedQuestionAnswer[] {
        return this.answers.filter((e) => e.id == id);
    }
}

