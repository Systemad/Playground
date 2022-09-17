import { Box, SimpleGrid, useToast } from '@chakra-ui/react';
import { Navigate, useNavigate } from 'react-router-dom';

import {
    useLobbyGetGamesQuery,
    useLobbyJoinGameMutation,
} from '../api/lobbyAPI';
import { LobbyCard } from '../components/LobbyCard';
import { UseLobbySocket } from '../hooks/UseLobbySocket';

export const LobbyLayout = () => {
    const { data: lobbies } = useLobbyGetGamesQuery();
    const [join, result] = useLobbyJoinGameMutation();
    const navigate = useNavigate();
    const toast = useToast();

    UseLobbySocket();

    const handleJoinGame = async (id?: string) => {
        try {
            if (id) {
                await join({ gameId: id })
                    .unwrap()
                    .then((payload) => console.log('fulfilled', payload))
                    .then(() => navigate(id));
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
