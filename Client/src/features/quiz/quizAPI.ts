import { Category, Difficulty, GameState } from '../enums';
import { emptySplitApi as api } from "./../../providers/emptyApi";
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
export type QuizSettingsModel = {
  limit?: number;
  category?: Category;
  difficulty?: Difficulty;
};
export const {
  useQuizCreateGameMutation,
  useQuizStartGameMutation,
  useQuizSetGameSettingsMutation,
} = injectedRtkApi;
