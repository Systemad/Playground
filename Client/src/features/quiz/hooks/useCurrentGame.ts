import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MyParams } from '../../../utils/routerParams';

export const useCurrentGame = () => {
    const [currentGame, setCurrentGame] = useState<string | undefined>();
    const { gameId } = useParams<keyof MyParams>() as MyParams;

    useEffect(() => {
        setCurrentGame(gameId);
    }, [gameId]);
    return currentGame;
};
