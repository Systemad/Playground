import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { JoinGame, LeaveGame } from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import { useQuizGetGameRuntimeQuery } from '../api/quizAPI';
import { Game } from '../components/Game';
import { PreGame } from '../components/PreGame';
// TODO: When game ends, navigate to gameid/results
export const Quiz = () => {
    const { gameId } = useParams<keyof MyParams>() as MyParams;
    const { data: game } = useQuizGetGameRuntimeQuery({ gameId: gameId });
    //UseQuizSocket(gameId);
    const ready = game?.active === true;
    useEffect(() => {
        JoinGame(gameId);
        return () => {
            LeaveGame(gameId);
        };
    }, [gameId]);
    if (!ready)
        return (
            <PreGame
                gameId={gameId}
                ownerId={game?.ownerId}
                scoreboard={game?.scoreboard}
            />
        );

    return <Game gameId={gameId} runtime={game} />;
};
