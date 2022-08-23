import { Box, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useLobbyGetGamesQuery } from '../api/lobbyAPI';
import { LobbyCard } from '../components/LobbyCard';
import { UseLobbySocket } from '../hooks/UseLobbySocket';

export const LobbyLayout = () => {

  const { data: lobbies } = useLobbyGetGamesQuery();
  const navigate = useNavigate();

  UseLobbySocket();

  const joinGame = (id: string): void => {
    navigate(`quiz/${id}`);
  };

  return (
    <>
      <Box as='main' maxW='7xl' mx='auto' my='auto' p={6}>
        <SimpleGrid columns={[1, 2, 3]} spacing='15px'>
          {lobbies?.map((lobby) => (
            <LobbyCard key={lobby.id}
                       id={lobby!.id!}
                       title={lobby!.name!}
                       gameMode={lobby!.mode!}
                       gameStatus={lobby!.state!}
                       players={lobby!.players!}
                       onClick={joinGame} />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
};