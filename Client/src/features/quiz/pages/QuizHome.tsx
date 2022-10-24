import { Box, Flex, SimpleGrid, Stack, useToast } from '@chakra-ui/react';
import { HubConnectionState } from '@microsoft/signalr';
import React, { useContext, useEffect } from 'react';

import { useAppSelector } from '../../../providers/store';
import { selectGame } from '../../../redux/quizSlice';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { GameCard } from '../../game-browser/components/GameCard';
import { useGames } from '../../game-browser/hooks/useGames';
import { CreateQuizComponent } from '../components/CreateQuizComponent';
import { Game } from '../components/Game';
import { QuizLobby } from '../components/QuizLobby';
import { useQuizGame } from '../hooks/useQuizGame';

// Add Leave button to navbar?
export const QuizHome = () => {
    useQuizGame();

    const socket = useContext(socketctx);
    const game = useAppSelector(selectGame);
    const gameId = game.runtime?.gameId;

    const games = useGames();
    const toast = useToast();

    const inGame = game.runtime !== undefined;
    const inProgress = inGame && game.runtime?.status === 'InProgress';
    const isWaiting = inGame && game.runtime?.status === 'AwaitingPlayers';
    //const isGameReady = inGame && game.gameStatus === 'Ready';
    const isGameEnded = inGame && game.runtime?.status === 'Finished';

    useEffect(() => {
        const GetGames = async () => {
            if (socket?.state === HubConnectionState.Connected)
                await socket?.invoke('get-all-games');
        };
        GetGames();
    }, [socket]);

    const handleJoinGame = (id: string) => {
        try {
            socket?.invoke('join-game', id);

            //socket?.invoke('join-game', id);
        } catch {
            toast({
                title: 'An error occurred',
                description: 'Game does not exist, create new one',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    /*
    useEffect(() => {
        return () => {
            if (gameId) socket?.invoke('leave-game', gameId);

        };
    }, [gameId, socket]);
    */

    return (
        <>
            {inProgress && <Game />}

            {isWaiting && <QuizLobby />}

            {isGameEnded && <>Game finished, fetch results</>}

            {!inGame && (
                <>
                    <Stack
                        overflow={'hidden'}
                        h={'95vh'}
                        direction={{ base: 'column', md: 'row' }}
                    >
                        <Flex align={'center'} justify={'center'}>
                            <CreateQuizComponent />
                        </Flex>
                        {games.length > 0 && (
                            <Flex flex={1} align={'center'} justify={'center'}>
                                <SimpleGrid columns={2} spacing={6}>
                                    {games.map((games) => (
                                        <GameCard
                                            key={games.id}
                                            id={games.id}
                                            name={games.name}
                                            gameMode={games.mode}
                                            players={games.players}
                                            gameStatus={games.status}
                                            difficulty={games?.difficulty}
                                            onClick={handleJoinGame}
                                        />
                                    ))}
                                </SimpleGrid>
                            </Flex>
                        )}
                    </Stack>
                </>
            )}
        </>
    );
};
