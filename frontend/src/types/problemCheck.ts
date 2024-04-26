interface ProblemCheckAnswer {
    fieldName: string;
    fieldValue: string;
}

interface ProblemCheckRequest {
    answers: ProblemCheckAnswer[];
}

interface ProblemCheckResponse {
    status: string;
    contensts: string;
    progress_changed: boolean;
    current_score: number; // number of correct points
    total_possible: number; // total possible points
    attempts_used: number;
}

