import queryString from 'query-string';

interface ProblemCheckRequestParser {
    parse(query: string): ProblemCheckRequest;
}

class GenericRequestQueryParser implements ProblemCheckRequestParser {
    /**
     * На входе может быть:
     * Список для чекбоксов (ключ одинаковый) - input_ca9acf0940402012f1fd_2_1[]=choice_0&input_ca9acf0940402012f1fd_2_1[]=choice_2
     * Список для нескольких заданий - input_9484b0b47faf45b2b05e02fd9f8b2ec0_2_1=1&input_9484b0b47faf45b2b05e02fd9f8b2ec0_3_1=1&input_9484b0b47faf45b2b05e02fd9f8b2ec0_9_1=choice_0
     * Одно значение - input_822b2ab835e13c0a41ea_2_1=choice_1
     *
     * Вызвращает список из пар ключ-значение, где ключ - идентификатор, значение - число/choice_x/текст
     */
    parse(query: string): ProblemCheckRequest {
        throw new Error('Not implemented. Prase query');
        const parsed = queryString.parse(query);

        const answers: ProblemCheckAnswer[] = [];

        for (const key in parsed) {
            if (parsed[key] === undefined || parsed[key] === null) {
                continue;
            }
            if (parsed[key] instanceof Array) {
                console.error('Array values are not supported');
                continue;
            }
            answers.push({fieldName: key, fieldValue: parsed[key] as string});
        }

        return {answers};
    }
}

