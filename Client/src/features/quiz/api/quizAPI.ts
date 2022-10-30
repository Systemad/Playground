import { emptySplitApi as api } from '../../../providers/emptyApi';
import { GameStatus } from '../../game-browser/api/lobbyAPI';
import { WebsocketEvents } from '../Events';
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
        quizGetGameRuntime: build.query<
            QuizGetGameRuntimeApiResponse,
            QuizGetGameRuntimeApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/quiz/id:guid/runtime`,
                params: { gameId: queryArg.gameId },
            }),
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded; // TODO: Fix this??
                } catch {}
                await cacheEntryRemoved;
            },
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
export type QuizGetGameRuntimeApiResponse = /** status 200  */ QuizRuntime;
export type QuizGetGameRuntimeApiArg = {
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
    timeout?: number;
};
export type QuizSettings = {
    type: string;
    category: string;
    difficulty: string;
    questions: number;
};
export type ProcessedQuestion = {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    number: number;
    answers: string[];
};
export type PlayerState = {
    id: string;
    name: string;
    score: number;
    answered?: boolean;
    answeredCorrectly?: boolean | null;
};
export type QuizRuntime = {
    //status: GameStatus;
    numberOfQuestions: number;
    timeout: number;
    ownerId: string;
    quizSettings: QuizSettings;
};
export type PlayerResult = {
    id: string;
    name: string;
    score: number;
};
export type GameResult = {
    winner: string;
    scoreboard: PlayerResult[];
};
export const {
    useQuizCreateGameMutation,
    useQuizGetGameRuntimeQuery,
    useQuizGetGameResultsQuery,
} = injectedRtkApi;
