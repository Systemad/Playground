import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { Game } from '../components/Game';
import { PreGame } from '../components/PreGame';
import { useCurrentGame } from '../hooks/useCurrentGame';
import { useGameActive } from '../hooks/useGameActive';
import { useQuizSettings } from '../hooks/useQuizSettings';
import { useScoreboard } from '../hooks/useScoreboard';
// TODO: When game ends, navigate to gameid/results
export const Quiz = () => {
    const ready = useGameActive();
    const gameId = useCurrentGame();
    const settings = useQuizSettings();
    const scoreboard = useScoreboard();
    const socket = useContext(SocketContext);
    useEffect(() => {
        if (gameId) socket.invoke('join-game', gameId); //.catch(() => navigate('/'));
        return () => {
            if (gameId) socket.invoke('leave-game', gameId);
        };
    }, [gameId, socket]);

    return (
        <>
            {gameId && !ready && (
                <PreGame scoreboard={scoreboard} ownerId={settings.ownerId} /> // TODO: Fix undefined
            )}
            {gameId && ready && <Game gameId={gameId} />}
            {!gameId && (
                <>You are not in a game, back out to home and join one</>
            )}
        </>
    );
};

// TODO: Handle joining Quiz with URL.
// User Clicks joins game, it sends to server join game, then sends back to "new-quiz", so lobby does NOT NAVIGATE!!!
// That should be handled by hook
// if Game does not exist, throw exception in server, in Client catch that, and set game to UNDEFINED!!!
