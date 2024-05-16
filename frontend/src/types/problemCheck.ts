export type QuestionId = string;
export type QuestionAnswer = string;

export interface ProblemCheckRequest {
    answers: Map<QuestionId, QuestionAnswer[]>
}

export interface ProblemCheckResponse {
    status: string;
    contents: string;
    progress_changed: boolean;
    current_score: number; // number of correct points
    total_possible: number; // total possible points
    attempts_used: number;
}

