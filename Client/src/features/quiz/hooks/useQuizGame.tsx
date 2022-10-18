import { useContext, useEffect } from 'react';

import { useAppDispatch } from '../../../providers/store';
import {
    leaveGame,
    QuizRuntime,
    setGame,
    setGameStatus,
} from '../../../redux/quizSlice';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { GameStatus } from '../../game-browser/api/lobbyAPI';

export const useQuizGame = () => {
    const connection = useContext(socketctx);

    const dispatch = useAppDispatch();
    useEffect(() => {
        const gameListener = (game: QuizRuntime) => {
            //setGame(gameId);
            if (game) dispatch(setGame(game));
            console.log('setgame: ' + game.gameId);
        };
        const statusListener = (status: GameStatus) => {
            console.log('statusListener: ' + status);
            dispatch(setGameStatus(status));
        };

        connection?.on('new-game-id', gameListener);
        connection?.on('status-update', statusListener);
        return () => {
            connection?.off('new-game-id', gameListener);
            connection?.off('status-update', statusListener);
        };
    }, [connection, dispatch]);

    useEffect(() => {
        const gameResetListener = () => {
            dispatch(leaveGame());
        };
        connection?.on('game-reset', gameResetListener);

        return () => {
            connection?.off('game-reset', gameResetListener);
        };
    }, [connection, dispatch]);
};
