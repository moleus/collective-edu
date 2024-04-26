import queryString from 'query-string';

const parse = (query: string) : ProblemCheckRequest => {
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
