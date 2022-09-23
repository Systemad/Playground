import { Box, SimpleGrid, useToast } from '@chakra-ui/react';
import { Navigate, useNavigate } from 'react-router-dom';

import connection from '../../../utils/api/signalr/Socket';
import { GameMode, useLobbyGetGamesQuery } from '../api/lobbyAPI';
import { LobbyCard } from '../components/LobbyCard';
import { UseLobbySocket } from '../hooks/UseLobbySocket';

export const LobbyLayout = () => {
    const { data: lobbies } = useLobbyGetGamesQuery();
    const navigate = useNavigate();
    const toast = useToast();

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
                await connection
                    .invoke('JoinGame', id)
                    .then(() => navigate(`${route}/${id}`));
            }
        } catch {
            toast({
                title: 'An error occurred',
                description: 'Could not join game, please try again!',
                status: 'error',
                duration: 2500,
                isClosable: true,
            });
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
                            gameStatus={lobby?.state}
                            players={lobby?.players}
                            onClick={handleJoinGame}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </>
    );
};
