import { emptySplitApi as api } from '../../../providers/emptyApi';
import { GameState } from '../../enums';
const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        quizCreateGame: build.mutation<
            QuizCreateGameApiResponse,
            QuizCreateGameApiArg
        >({
            query: (queryArg) => ({
                url: '/api/v1/quiz/create',
                method: 'POST',
                body: queryArg.quizSettingsModel,
            }),
        }),
        quizStartGame: build.mutation<
            QuizStartGameApiResponse,
            QuizStartGameApiArg
        >({
            query: (queryArg) => ({
                url: '/api/v1/quiz/id:guid/start',
                method: 'POST',
                params: { gameId: queryArg.gameId },
            }),
        }),
        quizSetGameSettings: build.mutation<
            QuizSetGameSettingsApiResponse,
            QuizSetGameSettingsApiArg
        >({
            query: (queryArg) => ({
                url: '/api/v1/quiz/id:guid/settings',
                method: 'POST',
                body: queryArg.quizSettingsModel,
                params: { gameId: queryArg.gameId },
            }),
        }),
        quizGetGameSettings: build.query<
            QuizGetGameSettingsApiResponse,
            QuizGetGameSettingsApiArg
        >({
            query: (queryArg) => ({
                url: '/api/v1/quiz/id:guid/settings',
                params: { gameId: queryArg.gameId },
            }),
        }),
        quizGetGameRuntime: build.query<
            QuizGetGameRuntimeApiResponse,
            QuizGetGameRuntimeApiArg
        >({
            query: (queryArg) => ({
                url: '/api/v1/quiz/id:guid/runtime',
                params: { gameId: queryArg.gameId },
            }),
        }),
        quizGetGameScoreboard: build.query<
            QuizGetGameScoreboardApiResponse,
            QuizGetGameScoreboardApiArg
        >({
            query: (queryArg) => ({
                url: '/api/v1/quiz/id:guid/score',
                params: { gameId: queryArg.gameId },
            }),
        }),
    }),
    overrideExisting: false,
});
export { injectedRtkApi as quizSplitApi };
export type QuizCreateGameApiResponse = /** status 200  */ string;
export type QuizCreateGameApiArg = {
    quizSettingsModel: QuizSettingsModel;
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
export type QuizGetGameScoreboardApiResponse = /** status 200  */ {
    players: PlayerRuntime[];
};
export type QuizGetGameScoreboardApiArg = {
    gameId?: string;
};
export type QuizSettingsModel = {
    name?: string;
    questions?: number;
    category?: string;
    difficulty?: string;
};
export type QuizSettingState = {
    category?: string;
    difficulty?: string;
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
export type PlayerRuntime = {
    id?: string;
    name?: string;
    score?: number;
    answered?: boolean;
};
export const {
    useQuizCreateGameMutation,
    useQuizStartGameMutation,
    useQuizSetGameSettingsMutation,
    useQuizGetGameSettingsQuery,
    useQuizGetGameRuntimeQuery,
    useQuizGetGameScoreboardQuery,
} = injectedRtkApi;
