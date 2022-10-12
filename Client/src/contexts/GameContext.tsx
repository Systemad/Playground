import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import { socketctx } from '../utils/api/signalr/ContextV2';

interface Props {
    children?: ReactNode;
}

type GameInfo = {
    gametype: string;
    gameId: string;
};

export const GameContext = createContext<string | undefined>(undefined);

export const GameProvider = ({ children }: Props) => {
    const [game, setGame] = useState<string | undefined>(undefined);
    const socket = useContext(socketctx);

    useEffect(() => {
        const gameListener = (gameId: string) => {
            setGame(gameId);
            console.log('setgame: ' + gameId);
        };
        socket?.on('new-game-id', gameListener);
        return () => {
            socket?.off('new-game-id', gameListener);
        };
    }, [socket]);

    useEffect(() => {
        const gameResetListener = () => setGame(undefined);
        socket?.on('game-finished', gameResetListener);
        return () => {
            socket?.off('game-finished', gameResetListener);
        };
    }, [socket]);
    return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};
