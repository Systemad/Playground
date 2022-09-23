import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import { useQuizGetGameRuntimeQuery } from '../api/quizAPI';
import { Game } from '../components/Game';
import { PreGame } from '../components/PreGame';
// TODO: When game ends, navigate to gameid/results
export const Quiz = () => {
    const { gameId } = useParams<keyof MyParams>() as MyParams;

    const { data: game } = useQuizGetGameRuntimeQuery({ gameId: gameId });
    const ready = game?.gameActive === true;

    useEffect(() => {
        return () => {
            connection.invoke('LeaveGame', gameId);
        };
    });
    if (!ready)
        return (
            <PreGame
                gameId={gameId}
                ownerId={game?.settings?.ownerUserId}
                scoreboard={game?.scoreboard}
            />
        );

    return <Game gameId={gameId} runtime={game} />;
};
