import { emptySplitApi as api } from '../../../providers/emptyApi';
const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        lobbyGetGames: build.query<
            LobbyGetGamesApiResponse,
            LobbyGetGamesApiArg
        >({
            query: () => ({ url: `/api/v1/lobby/games`, refetchOnFocus: true }),
        }),
        lobbyJoinGame: build.mutation<
            LobbyJoinGameApiResponse,
            LobbyJoinGameApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/lobby/id:guid/join`,
                method: 'POST',
                params: { gameId: queryArg.gameId },
            }),
        }),
        lobbyLeaveGame: build.mutation<
            LobbyLeaveGameApiResponse,
            LobbyLeaveGameApiArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/lobby/id:guid/leave`,
                method: 'POST',
                params: { gameId: queryArg.gameId },
            }),
        }),
    }),
    overrideExisting: false,
});
export { injectedRtkApi as lobbySplitApi };
export type LobbyGetGamesApiResponse = /** status 200  */ GameLobbySummary[];
export type LobbyGetGamesApiArg = void;
export type LobbyJoinGameApiResponse = unknown;
export type LobbyJoinGameApiArg = {
    gameId?: string;
};
export type LobbyLeaveGameApiResponse = unknown;
export type LobbyLeaveGameApiArg = {
    gameId?: string;
};
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
export const {
    useLobbyGetGamesQuery,
    useLobbyJoinGameMutation,
    useLobbyLeaveGameMutation,
} = injectedRtkApi;
