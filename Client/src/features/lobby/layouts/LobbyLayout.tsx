import { Box, SimpleGrid, useToast } from '@chakra-ui/react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { hubConnection, JoinGame } from '../../../utils/api/signalr/Socket';
import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { GameMode, useLobbyGetGamesQuery } from '../api/lobbyAPI';
import { LobbyCard } from '../components/LobbyCard';
import { UseLobbySocket } from '../hooks/UseLobbySocket';

export const LobbyLayout = () => {
    const { data: lobbies } = useLobbyGetGamesQuery();
    const navigate = useNavigate();
    const toast = useToast();
    const socket = useContext(SocketContext);
    UseLobbySocket();

    const handleJoinGame = async (id?: string, mode?: GameMode) => {
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
                    .invoke('joingame', id)
                    .then(() => navigate(`${route}/${id}`));
            }
        } catch {
            toast({
                title: 'An error occurred',
                description: 'Game does not exist, create new onw',
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
                    {lobbies?.map((lobby) => (
                        <LobbyCard
                            id={lobby!.id!}
                            key={lobby.id}
                            difficulty={'hard'}
                            name={lobby?.name}
                            gameMode={lobby?.mode}
                            gameStatus={lobby?.status}
                            players={lobby?.players}
                            onClick={handleJoinGame}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </>
    );
};
