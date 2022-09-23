import { emptySplitApi as api } from '../../../providers/emptyApi';
const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        quizCreateGame: build.mutation<
            QuizCreateGameApiResponse,
            QuizCreateGameApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/quiz/create`,
                method: 'POST',
                body: queryArg.quizCreationModel,
            }),
        }),
        quizSetGameSettings: build.mutation<
            QuizSetGameSettingsApiResponse,
            QuizSetGameSettingsApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/quiz/id:guid/settings`,
                method: 'POST',
                body: queryArg.quizCreationModel,
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
        quizGetGameScoreboard: build.query<
            QuizGetGameScoreboardApiResponse,
            QuizGetGameScoreboardApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/quiz/id:guid/score`,
                params: { gameId: queryArg.gameId },
            }),
        }),
        quizGetGameResults: build.query<
            QuizGetGameResultsApiResponse,
            QuizGetGameResultsApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/quiz/id:guid/results`,
                params: { gameId: queryArg.gameId },
            }),
        }),
    }),
    overrideExisting: false,
});
export { injectedRtkApi as quizSplitApi };
export type QuizCreateGameApiResponse = /** status 200  */ string;
export type QuizCreateGameApiArg = {
    quizCreationModel: QuizCreationModel;
};
export type QuizSetGameSettingsApiResponse = unknown;
export type QuizSetGameSettingsApiArg = {
    gameId?: string;
    quizCreationModel: QuizCreationModel;
};
export type QuizGetGameRuntimeApiResponse = /** status 200  */ Runtime;
export type QuizGetGameRuntimeApiArg = {
    gameId?: string;
};
export type QuizGetGameScoreboardApiResponse = /** status 200  */ Scoreboard;
export type QuizGetGameScoreboardApiArg = {
    gameId?: string;
};
export type QuizGetGameResultsApiResponse = /** status 200  */ GameResult;
export type QuizGetGameResultsApiArg = {
    gameId?: string;
};
export type QuizCreationModel = {
    name?: string;
    questions?: number;
    category?: string;
    difficulty?: string;
    type?: string;
};
export type ProcessedQuestion = {
    category?: string;
    type?: string;
    difficulty?: string;
    question?: string;
    answers?: string[];
};
export type Settings = {
    ownerUserId?: string;
    name?: string;
    type?: string;
    category?: string;
    difficulty?: string;
    questions?: number;
};
export type PlayerRuntime = {
    id?: string;
    name?: string;
    score?: number;
    answered?: boolean | null;
    answeredCorrectly?: boolean | null;
    ready?: boolean | null;
};
export type Scoreboard = {
    gameId?: string;
    players?: PlayerRuntime[];
};
export type Runtime = {
    gameActive?: boolean;
    currentQuestion?: ProcessedQuestion | null;
    questions?: number;
    questionStep?: number;
    numberOfPlayers?: number;
    settings?: Settings;
    scoreboard?: Scoreboard;
};
export type PlayerResult = {
    id?: string;
    name?: string;
    score?: number;
};
export type GameResult = {
    gameId?: string;
    name?: string;
    scoreboard?: PlayerResult[];
    category?: string;
    difficulty?: string;
    questions?: number;
};
export const {
    useQuizCreateGameMutation,
    useQuizSetGameSettingsMutation,
    useQuizGetGameRuntimeQuery,
    useQuizGetGameScoreboardQuery,
    useQuizGetGameResultsQuery,
} = injectedRtkApi;
