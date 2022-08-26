import { useEffect } from 'react'

import { useAppDispatch } from '../../../providers/store'
import connection from '../../../utils/api/signalr/Socket'
import { GameLobbySummary, lobbySplitApi } from '../api/lobbyAPI'

enum LobbyActions {
    AddGame = 'AddGame',
    RemoveGame = 'RemoveGame',
    EditGame = 'EditGame',
}

export function UseLobbySocket(): void {
    const dispatch = useAppDispatch()

    useEffect(() => {
        connection.on(LobbyActions.AddGame, (game: GameLobbySummary) => {
            dispatch(
                lobbySplitApi.util.updateQueryData(
                    'lobbyGetGames',
                    undefined,
                    (draft) => {
                        draft.push(game)
                    }
                )
            )
        })

        connection.on(LobbyActions.RemoveGame, (gameId: string) => {
            dispatch(
                lobbySplitApi.util.updateQueryData(
                    'lobbyGetGames',
                    undefined,
                    (draft) => {
                        draft.filter((l) => l.id !== gameId)
                    }
                )
            )
        })

        connection.on(LobbyActions.EditGame, (game: GameLobbySummary) => {
            dispatch(
                lobbySplitApi.util.updateQueryData(
                    'lobbyGetGames',
                    undefined,
                    (draft) => {
                        const gameIndex = draft.findIndex(
                            (l) => l.id === game.id
                        )
                        draft[gameIndex] = game
                    }
                )
            )
        })
    })
}
