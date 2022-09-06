import { Box, SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import connection from '../../../utils/api/signalr/Socket';
import { GameMode, GameState } from '../../enums';
import { useLobbyGetGamesQuery } from '../api/lobbyAPI';
import { LobbyCard } from '../components/LobbyCard';
import { UseLobbySocket } from '../hooks/UseLobbySocket';

export const LobbyLayout = () => {
    const { data: lobbies } = useLobbyGetGamesQuery();
    const navigate = useNavigate();

    UseLobbySocket();

    const joinGame = async (id?: string) => {
        if (id) {
            await connection.invoke('JoinGame', id);
            navigate(`quiz/${id}`);
        }
    };

    return (
        <>
            <Box as="main" maxW="7xl" mx="auto" my="auto" p={6}>
                <SimpleGrid columns={[1, 2, 3]} spacing="15px">
                    <LobbyCard
                        key={1}
                        name="hello"
                        gameMode={GameMode.Quiz}
                        gameStatus={GameState.InProgress}
                        difficulty="Hard"
                        players={2}
                        onClick={() => joinGame('1')}
                    />
                    <LobbyCard
                        key={2}
                        name="hello"
                        gameMode={GameMode.Quiz}
                        gameStatus={GameState.InProgress}
                        difficulty="Hard"
                        players={1}
                        onClick={() => joinGame('1')}
                    />
                    {lobbies?.map((lobby) => (
                        <LobbyCard
                            key={lobby.id}
                            name={lobby?.name}
                            gameMode={lobby?.mode}
                            gameStatus={lobby?.state}
                            players={lobby?.players}
                            onClick={() => joinGame(lobby?.id)}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </>
    );
};
