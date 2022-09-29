import { useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import { hubConnection } from '../../../utils/api/signalr/Socket';
import { GameLobbySummary, lobbySplitApi } from '../api/lobbyAPI';

enum LobbyActions {
    AddGame = 'AddGame',
    RemoveGame = 'RemoveGame',
    EditGame = 'EditGame',
}

export function UseLobbySocket(): void {
    const dispatch = useAppDispatch();

    useEffect(() => {
        hubConnection.on(LobbyActions.AddGame, (game: GameLobbySummary) => {
            dispatch(
                lobbySplitApi.util.updateQueryData(
                    'lobbyGetGames',
                    undefined,
                    (draft) => {
                        draft.push(game);
                    }
                )
            );
        });

        hubConnection.on(LobbyActions.RemoveGame, (gameId: string) => {
            dispatch(
                lobbySplitApi.util.updateQueryData(
                    'lobbyGetGames',
                    undefined,
                    (draft) => {
                        draft.filter((l) => l.id !== gameId);
                    }
                )
            );
        });

        hubConnection.on(LobbyActions.EditGame, (game: GameLobbySummary) => {
            dispatch(
                lobbySplitApi.util.updateQueryData(
                    'lobbyGetGames',
                    undefined,
                    (draft) => {
                        const gameIndex = draft.findIndex(
                            (l) => l.id === game.id
                        );
                        draft[gameIndex] = game;
                    }
                )
            );
        });
    });
}
