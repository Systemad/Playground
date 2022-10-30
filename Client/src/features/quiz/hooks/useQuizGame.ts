import { useContext, useEffect } from 'react';

import store, { useAppDispatch } from '../../../providers/store';
import {
    leaveGame,
    QuizRuntime,
    setGame,
    setGameStatus,
} from '../../../redux/quizSlice';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { GameStatus } from '../../game-browser/api/lobbyAPI';

const gameResetListener = () => {
    store.dispatch(leaveGame());
};

const gameUpdateListener = (game: QuizRuntime) => {
    //setGame(gameId);
    store.dispatch(setGame(game));
    console.log('updategamelistener: ' + game.gameId + game.status);
};

export const useQuizGame = () => {
    const connection = useContext(socketctx);

    //const dispatch = useAppDispatch();
    useEffect(() => {
        /*
        const gameUpdateListener = (game: QuizRuntime) => {
            //setGame(gameId);
            dispatch(setGame(game));
            console.log('updategamelistener: ' + game.gameId + game.status);
        };
        */

        connection?.on('update-game', gameUpdateListener);
        return () => {
            connection?.off('update-game', gameUpdateListener);
        };
    }, [connection]);

    useEffect(() => {
        //const gameResetListener = () => {
        //    dispatch(leaveGame());
        //};
        connection?.on('game-reset', gameResetListener);

        return () => {
            connection?.off('game-reset', gameResetListener);
        };
    }, [connection]);
};
