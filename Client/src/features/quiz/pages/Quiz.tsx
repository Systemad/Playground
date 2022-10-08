import * as signalR from '@microsoft/signalr';
import { useEffect } from 'react';

import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';
import { Game } from '../components/Game';
import { PreGame } from '../components/PreGame';
import { useCurrentGame } from '../hooks/useCurrentGame';
import { useQuizRuntime } from '../hooks/useQuizSettings';
import { useScoreboard } from '../hooks/useScoreboard';
// TODO: When game ends, navigate to gameid/results
export const Quiz = () => {
    const gameId = useCurrentGame();
    const runtime = useQuizRuntime();
    const scoreboard = useScoreboard();
    const hubConnection = useHubConnection();
    // FIX join when entering URL manually
    useEffect(() => {
        const JoinGame = async (id?: string) => {
            if (id) {
                try {
                    await hubConnection?.invoke('join-game', id);
                } catch {
                    //navigate('/');
                }
            }
        };
        JoinGame(gameId);

        //JoinGame().catch(() => navigate('/'));

        return () => {
            const LeaveGame = async (id?: string) => {
                if (id) {
                    try {
                        await hubConnection?.invoke('leave-game', id);
                    } catch {
                        //navigate('/');
                    }
                }
            };
            LeaveGame(gameId);
        };
    }, [gameId, hubConnection]);

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
