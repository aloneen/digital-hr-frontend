export type AiQuestionRequest = {
  question: string;
};

export type AiAnswerResponse = {
  answer: string;
  source: string;
  category: string;
  found: boolean;
  confidence: number;
};
