import { useParams } from 'react-router-dom';

import { MyParams } from '../../../utils/routerParams';
import { useQuizGetGameRuntimeQuery } from '../api/quizAPI';
import { Game } from '../components/Game';
import { PreGame } from '../components/PreGame';

// TODO: When game ends, navigate to gameid/results
export const Quiz = () => {
    const { gameId } = useParams<keyof MyParams>() as MyParams;

    const { data: game } = useQuizGetGameRuntimeQuery({ gameId: gameId });

    const ready = game?.gameActive === true;

    if (!ready) return <PreGame />;

    return <Game />;
};
