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
    const active = useGameActive();
    const gameId = useCurrentGame();
    const settings = useQuizSettings();
    const scoreboard = useScoreboard();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const JoinGame = async () => {
        if (gameId) {
            try {
                await socket.invoke('joingame', gameId);
            } catch {
                navigate('/');
            }
        }
    };

    const LeaveGame = async () => {
        if (gameId) {
            try {
                await socket.invoke('leavegame', gameId);
            } catch {
                navigate('/');
            }
        }
    };

    // FIX join when entering URL manually
    useEffect(() => {
        JoinGame();

        return () => {
            LeaveGame();
        };
    }, [gameId, socket]);

    return (
        <>
            {gameId && !active && settings && (
                <>
                    not active with settings
                    <PreGame
                        scoreboard={scoreboard}
                        ownerId={settings.ownerId}
                    />
                </>
            )}
            {gameId && active && settings && (
                <>
                    active with settings
                    <Game gameId={gameId} settings={settings} />
                </>
            )}
            {!gameId && (
                <>You are not in a game, back out to home and join one</>
            )}
        </>
    );
};
