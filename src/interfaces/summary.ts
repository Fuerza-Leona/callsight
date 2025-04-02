export interface Summary{
    summary_id: string;
    conversation_id: string;
    summary: string | null;
    problem: string | null;
    solution: string | null;
    duration: number;
    positive: number;
    neutral: number;
    negative: number;
}