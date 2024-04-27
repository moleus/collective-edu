interface AnswerChecker {
    isAnswerCorrect(questionId: string, answer: QuestionAnswer): boolean | null;
}

export class ProblemHtmlParserImpl implements AnswerChecker {
    private doc: Document;

    constructor(htmlBody: string) {
        if (!htmlBody) {
            throw new Error("htmlBody is empty")
        }
        const parser = new DOMParser()
        this.doc = parser.parseFromString(htmlBody, "text/html")
    }

    /*
     * 1. у нас есть id задания, например input_eaf0ec8e525342d2867f641f5d6ee9d0_7_1
     2. Находим элемент с id=input_eaf0ec8e525342d2867f641f5d6ee9d0_7_1
     3. В этом элементе смотрим на поле aria-describedby, в нем хранится id на результат ответа. Например, aria-describedby="status_eaf0ec8e525342d2867f641f5d6ee9d0_7_1"
     4. Находим этот элемент по id. Читаем class, например - class="status incorrect" или class="status correct"
     */
    isAnswerCorrect(questionId: QuestionId, answer: QuestionAnswer): boolean | null {
        const normQuestionId = this.getNormalizedQuestionId(questionId, answer)
        if (!normQuestionId) {
            return null
        }
        console.debug(`New question id: ${normQuestionId}`)

        const status = this.checkStatusUsingAriaLabel(questionId)
        if (status !== null) {
            return status
        }
        return this.checkStatusUsingLabel(normQuestionId)
    }

    // get label where 'for' attribute equals to questionId and check class 'choicegroup_correct'
    private checkStatusUsingLabel(normQuestionId: QuestionId): boolean | null {
        const label = this.doc.querySelector(`label[for="${normQuestionId}"]`)
        if (!label) {
            console.error(`Can't find label with 'for' attribute equals to '${normQuestionId}' in html`, this.doc)
            return null
        }
        if (!label.classList.contains("choicegroup_correct") && !label.classList.contains("choicegroup_incorrect")) {
            console.error(`Label with 'for' attribute equals to '${normQuestionId}' must contain 'choicegroup_correct' or 'choicegroup_incorrect' class`, label)
            return null
        }
        return label.classList.contains("choicegroup_correct")
    }

    private checkStatusUsingAriaLabel(normQuestionId: QuestionId): boolean | null {
        const questionEl = this.doc.getElementById(normQuestionId)
        if (!questionEl) {
            console.error(`Can't find question with id '${normQuestionId}' in html`, this.doc)
            return null
        }
        const statusElId = questionEl.getAttribute("aria-describedby")
        if (!statusElId) {
            console.error(`Can't find attribute 'aria-describedby' for element '${normQuestionId}' in html`, this.doc)
            return null
        }
        const statusEl = this.doc.getElementById(statusElId)
        if (!statusEl) {
            console.error(`Can't find status element with id '${statusElId}' in html`, this.doc)
            return null
        }

        if (!statusEl.classList.contains("status")) {
            console.error(`Status element with id '${statusElId}' must contain 'status' class`, statusEl)
            return null
        }
        return statusEl.classList.contains("correct")
    }

    getNormalizedQuestionId(questionId: QuestionId, answer: QuestionAnswer): QuestionId | null {
        const questionIdWithoutPrefix = questionId.replace(/^input_/, '')

        const inputId = `input_${questionIdWithoutPrefix}`
        if (this.doc.getElementById(inputId)) {
            return inputId
        }

        const choiceGroupId = `input_${questionIdWithoutPrefix}_${answer}`
        if (this.doc.getElementById(choiceGroupId)) {
            return choiceGroupId
        }

        console.error(`Can't find element with id '${inputId}' or '${choiceGroupId}' in html`, this.doc)
        return null
    }
}

