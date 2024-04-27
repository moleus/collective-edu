import { ProblemHtmlParserImpl } from '../src/checker/AnswerChecker'

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
