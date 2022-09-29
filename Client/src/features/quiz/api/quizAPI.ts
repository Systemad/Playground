import { emptySplitApi as api } from '../../../providers/emptyApi';
import { hubConnection } from '../../../utils/api/signalr/Socket';
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

                    const sbListener = (scoreboard: PlayerState[]) => {
                        updateCachedData((draft) => {
                            draft.scoreboard = scoreboard;
                        });
                    };

                    const startGameListener = (runtime: QuizRuntime) => {
                        console.log('Start in api');
                        updateCachedData((draft) => {
                            draft = runtime;
                        });
                    };
                    const stopGameListener = (runtime: QuizRuntime) => {
                        updateCachedData((draft) => {
                            draft = runtime;
                        });
                    };

                    const NextQuestionListener = (runtime: QuizRuntime) => {
                        updateCachedData((draft) => {
                            draft = runtime;
                        });
                    };

                    const playerAnsweredEvent = (playerId: string) => {
                        updateCachedData((draft) => {
                            var pl = draft.scoreboard?.find(
                                (p) => p.id == playerId
                            );
                            if (pl) pl.answered = true;
                        });
                    };

                    hubConnection.on(
                        WebsocketEvents.PlayerAnswered,
                        playerAnsweredEvent
                    );
                    hubConnection.on(
                        WebsocketEvents.NextQuestion,
                        NextQuestionListener
                    );
                    hubConnection.on(
                        WebsocketEvents.UpdateScoreboard,
                        sbListener
                    );
                    hubConnection.on(
                        WebsocketEvents.StartGame,
                        startGameListener
                    );
                    hubConnection.on(
                        WebsocketEvents.StopGame,
                        stopGameListener
                    );
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
    type?: string;
    category?: string;
    difficulty?: string;
    questions?: number;
};
export type ProcessedQuestion = {
    category?: string;
    type?: string;
    difficulty?: string;
    question?: string;
    answers?: string[];
};
export type PlayerState = {
    id?: string;
    name?: string;
    score?: number;
    answered?: boolean;
    answeredCorrectly?: boolean | null;
    ready?: boolean;
};
export type QuizRuntime = {
    active?: boolean;
    questionStep?: number;
    numberOfQuestions?: number;
    numberOfPlayers?: number;
    ownerId?: string;
    timeout?: number;
    quizSettings?: QuizSettings;
    currentQuestion?: ProcessedQuestion | null;
    scoreboard?: PlayerState[];
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
    useQuizGetGameRuntimeQuery,
    useQuizGetGameResultsQuery,
} = injectedRtkApi;
