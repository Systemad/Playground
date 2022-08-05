import { Category, Difficulty, GameState } from '../../enums';
import { emptySplitApi as api } from "..\\..\\..\\providers\\emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    quizCreateGame: build.mutation<
      QuizCreateGameApiResponse,
      QuizCreateGameApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/quiz/create/${queryArg.name}`,
        method: "POST",
      }),
    }),
    quizStartGame: build.mutation<
      QuizStartGameApiResponse,
      QuizStartGameApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/quiz/id:guid/start`,
        method: "POST",
        params: { gameId: queryArg.gameId },
      }),
    }),
    quizSetGameSettings: build.mutation<
      QuizSetGameSettingsApiResponse,
      QuizSetGameSettingsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/quiz/id:guid/settings`,
        method: "POST",
        body: queryArg.quizSettingsModel,
        params: { gameId: queryArg.gameId },
      }),
    }),
    quizGetGameSettings: build.query<
      QuizGetGameSettingsApiResponse,
      QuizGetGameSettingsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/quiz/id:guid/settings`,
        params: { gameId: queryArg.gameId },
      }),
    }),
    quizGetGameRuntime: build.query<
      QuizGetGameRuntimeApiResponse,
      QuizGetGameRuntimeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/quiz/id:guid/runtime`,
        params: { gameId: queryArg.gameId },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as quizSplitApi };
export type QuizCreateGameApiResponse = unknown;
export type QuizCreateGameApiArg = {
  name: string | null;
};
export type QuizStartGameApiResponse = /** status 200  */ GameState;
export type QuizStartGameApiArg = {
  gameId?: string;
};
export type QuizSetGameSettingsApiResponse = unknown;
export type QuizSetGameSettingsApiArg = {
  gameId?: string;
  quizSettingsModel: QuizSettingsModel;
};
export type QuizGetGameSettingsApiResponse =
  /** status 200  */ QuizSettingState;
export type QuizGetGameSettingsApiArg = {
  gameId?: string;
};
export type QuizGetGameRuntimeApiResponse = /** status 200  */ QuizRuntime;
export type QuizGetGameRuntimeApiArg = {
  gameId?: string;
};
export type QuizSettingsModel = {
  name?: string;
  limit?: number;
  category?: Category;
  difficulty?: Difficulty;
};
export type QuizSettingState = {
  category?: Category;
  difficulty?: Difficulty;
  questions?: number;
};
export type Answers = {
  answer_a?: string;
  answer_b?: string;
  answer_c?: string;
  answer_d?: string;
  answer_e?: any;
  answer_f?: any;
};
export type CorrectAnswers = {
  answer_a_correct?: string;
  answer_b_correct?: string;
  answer_c_correct?: string;
  answer_d_correct?: string;
  answer_e_correct?: string;
  answer_f_correct?: string;
};
export type Root = {
  id?: number;
  question?: string;
  description?: string;
  answers?: Answers;
  multiple_correct_answers?: string;
  correct_answers?: CorrectAnswers;
  explanation?: string;
  tip?: any;
  tags?: any[];
  category?: string;
  difficulty?: string;
};
export type Player = {
  id?: string;
  name?: string;
};
export type QuizRuntime = {
  gameActive?: boolean;
  currentQuestion?: Root;
  questions?: number;
  questionStep?: number;
  numberOfPlayers?: number;
  players?: Player[];
};
export const {
  useQuizCreateGameMutation,
  useQuizStartGameMutation,
  useQuizSetGameSettingsMutation,
  useQuizGetGameSettingsQuery,
  useQuizGetGameRuntimeQuery,
} = injectedRtkApi;
