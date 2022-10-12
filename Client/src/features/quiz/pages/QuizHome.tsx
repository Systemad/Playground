import { Box, SimpleGrid, Stack, useToast } from '@chakra-ui/react';
import { HubConnectionState } from '@microsoft/signalr';
import React, { useContext, useEffect } from 'react';

import { GameContext } from '../../../contexts/GameContext';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { LobbyCard } from '../../lobby/components/LobbyCard';
import { useLobbyGames } from '../../lobby/hooks/useLobbyGames';
import { CreateQuizComponent } from '../components/CreateQuizComponent';
import { Quiz } from './Quiz';

export const QuizHome = () => {
    const gameId = useContext(GameContext);
    const socket = useContext(socketctx);
    const games = useLobbyGames();
    const toast = useToast();

    useEffect(() => {
        const GetGames = async () => {
            if (socket?.state === HubConnectionState.Connected)
                await socket?.invoke('get-all-games');
        };
        GetGames();
    }, [socket]);
    const handleJoinGame = async (id: string) => {
        try {
            //navigate('/quiz');
            await socket?.invoke('join-game', id); //.then(() => navigate('/quiz'));
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

    useEffect(() => {
        return () => {
            const LeaveGame = async (id?: string) => {
                if (id) {
                    try {
                        await socket?.invoke('leave-game', id);
                    } catch {
                        //navigate('/');
                    }
                }
            };
            LeaveGame(gameId);
        };
    }, [gameId, socket]);
    return (
        <>
            {gameId && <Quiz />}

            {!gameId && (
                <>
                    <Box w="full" mx="auto" my="auto" p={6}>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                            <Stack>
                                <CreateQuizComponent />
                            </Stack>
                        </SimpleGrid>
                        {games.length > 0 && (
                            <>
                                {games.map((games) => (
                                    <LobbyCard
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
                            </>
                        )}
                    </Box>
                </>
            )}
        </>
    );
};

/*

export const LobbyLayout = () => {

    return (
        <>
            <Box as="main" maxW="7xl" mx="auto" my="auto" p={6}>
                <SimpleGrid columns={[1, 2, 3]} spacing="15px">
                    {games.length > 0 ? (
                        <>
                            {games.map((games) => (
                                <LobbyCard
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
                        </>
                    ) : (
                        <>No games are found, create one</>
                    )}
                </SimpleGrid>
            </Box>
        </>
    );
};

*/
