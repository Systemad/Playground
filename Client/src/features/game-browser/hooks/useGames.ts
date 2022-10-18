import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { GameLobbySummary } from '../api/lobbyAPI';

enum LobbyActions {
    AddGame = 'add-game',
    RemoveGame = 'remove-game',
    EditGame = 'edit-game',
    AllGames = 'all-games',
}

export const useGames = () => {
    const [games, setGames] = useState<GameLobbySummary[]>([]);
    const socket = useContext(socketctx);
    //const connection = useContext(socketctx);
    useEffect(() => {
        socket?.on(LobbyActions.AllGames, (games: GameLobbySummary[]) => {
            setGames(games);
        });

        socket?.on(LobbyActions.AddGame, (game: GameLobbySummary) => {
            setGames([...games, game]);
        });

        socket?.on(LobbyActions.RemoveGame, (gameId: string) => {
            setGames(games.filter((g) => g.id !== gameId));
        });

        socket?.on(LobbyActions.EditGame, (game: GameLobbySummary) => {
            const newArray = games.map((g, i) => {
                if (g.id === game.id) {
                    return game;
                }
                return g;
            });
            setGames(newArray);
        });
    }, [games, socket]);
    return games;
};
