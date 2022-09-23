import { emptySplitApi as api } from '../../../providers/emptyApi';
const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        lobbyGetGames: build.query<
            LobbyGetGamesApiResponse,
            LobbyGetGamesApiArg
        >({
            query: () => ({ url: `/api/v1/lobby/games` }),
        }),
    }),
    overrideExisting: false,
});
export { injectedRtkApi as lobbySplitApi };
export type LobbyGetGamesApiResponse = /** status 200  */ GameLobbySummary[];
export type LobbyGetGamesApiArg = void;
export type GameMode = 'Quiz' | 'TicTacToe' | 'Guessing';
export type GameState =
    | 'AwaitingPlayers'
    | 'Ready'
    | 'InProgress'
    | 'Finished'
    | 'Canceled';
export type GameLobbySummary = {
    id?: string;
    name?: string;
    mode?: GameMode;
    players?: number;
    state?: GameState;
    difficulty?: string | null;
};
export const { useLobbyGetGamesQuery } = injectedRtkApi;
