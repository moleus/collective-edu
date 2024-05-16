import { ProblemHtmlParserImpl } from '../src/checker/AnswerChecker'
import * as fs from 'fs';
import * as path from 'path';

describe('AnswerChecker', () => {
    it('should return null if question element not found', () => {
        const parser = new ProblemHtmlParserImpl('<div></div>')
        const result = parser.isAnswerCorrect('input_123', '1')
        expect(result).toBeNull()
    })

    it('should return null if status element not found', () => {
        const parser = new ProblemHtmlParserImpl('<div id="input_123" aria-describedby="status_123"></div>')
        const result = parser.isAnswerCorrect('input_123', '1')
        expect(result).toBeNull()
    })

    it('should return null if status element not found', () => {
        const parser = new ProblemHtmlParserImpl('<div id="input_123" aria-describedby="status_123"></div><div id="status_123"></div>')
        const result = parser.isAnswerCorrect('input_123', '1')
        expect(result).toBeNull()
    })

    it('should return false if status element has no correct class', () => {
        const parser = new ProblemHtmlParserImpl('<div id="input_123" aria-describedby="status_123"></div><div id="status_123" class="status incorrect"></div>')
        const result = parser.isAnswerCorrect('input_123', '1')
        expect(result).toBeFalsy()
    })

    it('should return true if status element has correct class', () => {
        const parser = new ProblemHtmlParserImpl('<div id="input_123" aria-describedby="status_123"></div><div id="status_123" class="status correct"></div>')
        const result = parser.isAnswerCorrect('input_123', '1')
        expect(result).toBeTruthy()
    })

    it('should return true if label near question element has correct class', () => {
        const parser = new ProblemHtmlParserImpl('<input id="input_123"><label for="input_123" class="random-class b choicegroup_correct"></label>')
        const result = parser.isAnswerCorrect('input_123', '1')
        expect(result).toBeTruthy()
    })

    it('should return false if label near question element has incorrect class', () => {
        const parser = new ProblemHtmlParserImpl('<input id="input_123"><label for="input_123" class="random-class b choicegroup_incorrect"></label>')
        const result = parser.isAnswerCorrect('input_123', '1')
        expect(result).toBeFalsy()
    })
})

describe('getNormalizedQuestionId', () => {
    it('should return input id if element exists', () => {
        const parser = new ProblemHtmlParserImpl('<div id="input_123"></div>')
        const result = parser.getNormalizedQuestionId('input_123', '1')
        expect(result).toBe('input_123')
    })

    it('should return choice group id if element exists', () => {
        const parser = new ProblemHtmlParserImpl('<div id="input_123_choice_1"></div>')
        const result = parser.getNormalizedQuestionId('input_123', 'choice_1')
        expect(result).toBe('input_123_choice_1')
    })

    it('should retun null if element not found', () => {
        const parser = new ProblemHtmlParserImpl('<div id="custominput_123"></div>')
        const result = parser.getNormalizedQuestionId('input_123', '1')
        expect(result).toBeNull()
    })
})

describe('AnswerChecker', () => {
    it('all answers should be correct', async () => {
        // Read HTML from the file
        const html = fs.readFileSync(path.resolve(__dirname, './samples/response_with_checkboxes.html'), 'utf-8');

        // Read questions from the JSON file
        const questions = JSON.parse(fs.readFileSync(path.resolve(__dirname, './samples/request_with_checkboxes.json'), 'utf-8'));

        // Create a new ProblemHtmlParserImpl instance with the HTML
        const parser = new ProblemHtmlParserImpl(html);

        // Iterate over the questions and check if all answers are correct
        for (let questionId in questions) {
            const answers = questions[questionId];
            for (let answer of answers) {
                const isCorrect = parser.isAnswerCorrect(questionId, answer);
                expect(isCorrect).toBeTruthy();
            }
        }
    });
});