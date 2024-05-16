import * as fs from 'fs';
import * as path from 'path';
import {MainProcessor, ProcessedQuestionAnswer} from "../src/checker/AllDataProcessor";
import {QuestionStorage} from "../src/checker/QuestionStorage";
import {ProblemCheckResponse} from "../src/types/problemCheck";

export class MockStorage implements QuestionStorage {
    savedData: ProcessedQuestionAnswer[] = [];

    async save(...answers: ProcessedQuestionAnswer[]): Promise<void> {
        this.savedData.push(...answers);
    }

    async get(id: string): Promise<ProcessedQuestionAnswer[]> {
        return this.savedData.filter(answer => answer.taskId === id);
    }

    async getMany(ids: string[]): Promise<ProcessedQuestionAnswer[][]> {
        return ids.map(id => this.savedData.filter(answer => answer.taskId === id));
    }
}

describe('MainProcessor', () => {
    it('sends correct answers to storage', async () => {
        const html = fs.readFileSync(path.resolve(__dirname, './samples/response_with_checkboxes.html'), 'utf-8');
        const questions = JSON.parse(fs.readFileSync(path.resolve(__dirname, './samples/request_with_checkboxes.json'), 'utf-8'));
        const expectedSolution = JSON.parse(fs.readFileSync(path.resolve(__dirname, './samples/expected_solution_request.json'), 'utf-8'))

        const mockStorage = new MockStorage()

        const mainProcessor = new MainProcessor(mockStorage);

        const responseBody: ProblemCheckResponse = {
            status: "correct",
            contents: html,
            progress_changed: true,
            current_score: 10,
            total_possible: 10,
            attempts_used: 1,
        }

        const processingData = {
            url: 'http://debug',
            requestBody: questions,
            responseBody: JSON.stringify(responseBody),
        }

        await mainProcessor.process(processingData);

        expect(mockStorage.savedData).toEqual(expectedSolution)
    });
});
