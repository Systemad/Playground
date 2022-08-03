export interface Root {
  id: number;
  question: string;
  description: string;
  answers: Answers;
  multiple_correct_answers: string;
  correct_answers: Correct_Answers;
  explanation: string;
  tip: any;
  tags: any[];
  category: string;
  difficulty: string;
}

export interface Answers {
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  answer_e: any;
  answer_f: any;
}

export interface Correct_Answers {
  answer_a_correct: string;
  answer_b_correct: string;
  answer_c_correct: string;
  answer_d_correct: string;
  answer_e_correct: string;
  answer_f_correct: string;
}