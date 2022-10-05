import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { Game } from '../components/Game';
import { PreGame } from '../components/PreGame';
import { useCurrentGame } from '../hooks/useCurrentGame';
import { useQuizRuntime } from '../hooks/useQuizSettings';
import { useScoreboard } from '../hooks/useScoreboard';
// TODO: When game ends, navigate to gameid/results
export const Quiz = () => {
    //const active = useGameActive();
    const gameId = useCurrentGame();
    const runtime = useQuizRuntime();
    const scoreboard = useScoreboard();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const JoinGame = async () => {
        if (gameId) {
            try {
                await socket.invoke('join-game', gameId);
            } catch {
                navigate('/');
            }
        }
    };

    const LeaveGame = async () => {
        if (gameId) {
            try {
                await socket.invoke('leave-game', gameId);
            } catch {
                navigate('/');
            }
        }
    };

    // FIX join when entering URL manually
    useEffect(() => {
        JoinGame();

        //JoinGame().catch(() => navigate('/'));

        return () => {
            LeaveGame();
        };
    }, [gameId, socket]);

    return (
        <>
            {gameId && runtime && (
                <>
                    {runtime.status === 'AwaitingPlayers' && (
                        <PreGame
                            scoreboard={scoreboard}
                            ownerId={runtime.ownerId}
                        />
                    )}

                    {runtime.status === 'InProgress' && (
                        <>
                            not active with settings
                            <Game gameId={gameId} runtime={runtime} />
                        </>
                    )}
                </>
            )}
            {!gameId && (
                <>You are not in a game, back out to home and join one</>
            )}
        </>
    );
};
