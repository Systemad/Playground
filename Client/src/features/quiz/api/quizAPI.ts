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
export type Result = {
  category?: string;
  type?: string;
  difficulty?: string;
  question?: string;
  correct_answer?: string;
  incorrect_answers?: string[];
};
export type Player = {
  id?: string;
  name?: string;
};
export type QuizRuntime = {
  gameActive?: boolean;
  currentQuestion?: Result;
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
