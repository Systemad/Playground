import { Box, SimpleGrid, useToast } from '@chakra-ui/react';
import { HubConnectionState } from '@microsoft/signalr';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { GameCard } from '../components/GameCard';
import { useGames } from '../hooks/useGames';

export const GameBrowserLayout = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const socket = useContext(socketctx);
    const games = useGames();

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
            navigate('/quiz');
        } catch {
            toast({
                title: 'An error occurred',
                description: 'Game does not exist, create new one',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            navigate('/');
        }
    };

    return (
        <>
            <Box as="main" maxW="7xl" mx="auto" my="auto" p={6}>
                <SimpleGrid columns={[1, 2, 3]} spacing="15px">
                    {games.length > 0 ? (
                        <>
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
                        </>
                    ) : (
                        <>No games are found, create one</>
                    )}
                </SimpleGrid>
            </Box>
        </>
    );
};
