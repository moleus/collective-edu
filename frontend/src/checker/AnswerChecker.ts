interface AnswerChecker {
    isAnswerCorrect(fieldId: string): boolean;
}
class ProblemHtmlParserImpl implements AnswerChecker {
    constructor(private readonly htmlBody: string) {}

    /*
     * 1. у нас есть id задания, например input_eaf0ec8e525342d2867f641f5d6ee9d0_7_1
     2. Находим элемент с id=input_eaf0ec8e525342d2867f641f5d6ee9d0_7_1
     3. В этом элементе смотрим на поле aria-describedby, в нем хранится id на результат ответа. Например, aria-describedby="status_eaf0ec8e525342d2867f641f5d6ee9d0_7_1"
     4. Находим этот элемент по id. Читаем class, например - class="status incorrect" или class="status correct"
     */
    isAnswerCorrect(fieldId: string): boolean {
        throw new Error('search result in HTML');
    }
}

