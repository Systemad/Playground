import { emptySplitApi as api } from '../../../providers/emptyApi'
import { GameMode, GameState } from '../../enums'
const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        lobbyGetGames: build.query<
            LobbyGetGamesApiResponse,
            LobbyGetGamesApiArg
        >({
            query: () => ({ url: '/api/v1/lobby/games' }),
        }),
    }),
    overrideExisting: false,
})
export { injectedRtkApi as lobbySplitApi }
export type LobbyGetGamesApiResponse = /** status 200  */ GameLobbySummary[]
export type LobbyGetGamesApiArg = void
export type GameLobbySummary = {
    id?: string
    name?: string
    mode?: GameMode
    players?: number
    state?: GameState
}
export const { useLobbyGetGamesQuery } = injectedRtkApi
