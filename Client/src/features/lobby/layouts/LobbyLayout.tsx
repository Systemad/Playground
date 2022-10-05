import { Box, SimpleGrid, useToast } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { GameMode } from '../api/lobbyAPI';
import { LobbyCard } from '../components/LobbyCard';
import { useLobbyGames } from '../hooks/useLobbyGames';

// TODO: Fix undefined difficulty and gamemode
export const LobbyLayout = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const socket = useContext(SocketContext);
    const games = useLobbyGames();

    useEffect(() => {
        const GetGames = async () => {
            await socket.invoke('get-all-games');
        };
        GetGames();
    }, [socket]);
    const handleJoinGame = async (id: string, mode: GameMode) => {
        console.log(mode);
        let route: string;
        switch (mode as GameMode) {
            case 'Quiz':
                route = 'quiz';
                break;
            case 'TicTacToe':
                route = 'tictactoe';
                break;
            case 'Guessing':
                route = 'guessing';
                break;
            default:
                break;
        }

        try {
            if (id) {
                socket
                    .invoke('join-game', id)
                    .then(() => navigate(`${route}/${id}`));
            }
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
                    {games ? (
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
