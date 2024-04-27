type QuestionId = string;
type QuestionAnswer = string;

interface ProblemCheckRequest {
    answers: Record<QuestionId, QuestionAnswer>
}

interface ProblemCheckResponse {
    status: string;
    contensts: string;
    progress_changed: boolean;
    current_score: number; // number of correct points
    total_possible: number; // total possible points
    attempts_used: number;
}

