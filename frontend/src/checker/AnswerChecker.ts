interface AnswerChecker {
    isAnswerCorrect(fieldId: string): boolean;
}

export class ProblemHtmlParserImpl implements AnswerChecker {
    private doc: Document;

    constructor(htmlBody: string) {
       const parser = new DOMParser()
       this.doc = parser.parseFromString(htmlBody, "text/html")
    }

    /*
     * 1. у нас есть id задания, например input_eaf0ec8e525342d2867f641f5d6ee9d0_7_1
     2. Находим элемент с id=input_eaf0ec8e525342d2867f641f5d6ee9d0_7_1
     3. В этом элементе смотрим на поле aria-describedby, в нем хранится id на результат ответа. Например, aria-describedby="status_eaf0ec8e525342d2867f641f5d6ee9d0_7_1"
     4. Находим этот элемент по id. Читаем class, например - class="status incorrect" или class="status correct"
     */
    isAnswerCorrect(questionId: QuestionId): boolean {
        const questionEl = this.doc.getElementById(questionId)
        if (!questionEl) {
            console.error(`Can't find question with id '${questionId}' in html`, this.doc)
            return false
        }
        const statusElId = questionEl.getAttribute("aria-describedby")
        if (!statusElId) {
            console.error(`Can't find attribute 'ariadescribedby' for element '${questionId}' in html`, this.doc)
            return false
        }
        const statusEl = this.doc.getElementById(statusElId)
        if (!statusEl) {
            console.error(`Can't find status element with id '${statusElId}' in html`, this.doc)
            return false
        }

        if (!statusEl.classList.contains("status")) {
            console.error(`Status element with id '${statusElId}' must contain 'status' class`, statusEl)
        }
        return statusEl.classList.contains("correct")
    }
}

