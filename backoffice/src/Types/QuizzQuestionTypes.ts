export type CreateQuizzQuestionDto = {
  question: string | null;
  possible_answers: string | null;
  correct_answer: string | null;
  quizz_id: string;
};

export type UpdateQuizzQuestionDto = {
  question: string | null;
  possible_answers: string | null;
  correct_answer: string | null;
};

export type CreateQuestionAnswerDto = {
  answer: string | null;
  quizz_question_id: string;
};

export type QuizzQuestionInfoDto = {
  id: string;
  question: string | null;
  possible_answers: string | null;
  correct_answer: string | null;
  quizz_id: string;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
};

export type QuestionAnswerInfoDto = {
  user_id: string;
  quizz_question_id: string;
  answer: string | null;
};
