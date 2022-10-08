import { useContext, useEffect, useState } from 'react';

import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';
import { GameLobbySummary } from '../api/lobbyAPI';

enum LobbyActions {
    AddGame = 'add-game',
    RemoveGame = 'remove-game',
    EditGame = 'edit-game',
    AllGames = 'all-games',
}

export const useLobbyGames = () => {
    const [games, setGames] = useState<GameLobbySummary[]>([]);
    const hubConnection = useHubConnection();
    useEffect(() => {
        hubConnection?.on(
            LobbyActions.AllGames,
            (games: GameLobbySummary[]) => {
                console.log('got all games');
                setGames(games);
            }
        );

        hubConnection?.on(LobbyActions.AddGame, (game: GameLobbySummary) => {
            setGames([...games, game]);
        });

        hubConnection?.on(LobbyActions.RemoveGame, (gameId: string) => {
            setGames(games.filter((g) => g.id !== gameId));
        });

        hubConnection?.on(LobbyActions.EditGame, (game: GameLobbySummary) => {
            const newArray = games.map((g, i) => {
                if (g.id === game.id) {
                    return game;
                }
                return g;
            });
            setGames(newArray);
        });
    }, [games, hubConnection]);
    return games;
};
