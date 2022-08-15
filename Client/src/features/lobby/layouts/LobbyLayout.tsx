import { Container, GridItem, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Difficulty, GameMode, GameState } from '../../enums';
import { useLobbyGetGamesQuery } from '../api/lobbyAPI';
import { LobbyCard } from '../components/LobbyCard';
import { UseLobbySocket } from '../hooks/UseLobbySocket';

export const LobbyLayout = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: lobbies } = useLobbyGetGamesQuery();
  const navigate = useNavigate();

  UseLobbySocket();

  const joinGame = (id: string): void => {
    console.log('haha');
    //navigate(`quiz/${id}`);
  };

  return (
    <>
      <GridItem area={'main'}>
        <Container maxW="7xl" mx='auto' my='auto' p={6}>
          <SimpleGrid columns={[1, 2, 3]} spacing='15px'>
            <LobbyCard id={'1'} onClick={() => joinGame('12')} key='1' title='hey' gameMode={GameMode.Quiz}
                       gameStatus={GameState.Ready} players={1} difficulty={Difficulty.Easy} />
            <LobbyCard id={'2'} onClick={() => joinGame('12')} key='1' title='hey' gameMode={GameMode.Quiz}
                       gameStatus={GameState.AwaitingPlayers} players={1} difficulty={Difficulty.Medium} />
            <LobbyCard id={'3'} onClick={() => joinGame('12')} key='1' title='hey' gameMode={GameMode.Quiz}
                       gameStatus={GameState.Canceled} players={1} difficulty={Difficulty.Hard} />
            <LobbyCard id={'4'} onClick={() => joinGame('12')} key='1' title='hey' gameMode={GameMode.Quiz}
                       gameStatus={GameState.Finished} players={1} />
            <LobbyCard id={'5'} onClick={() => joinGame('12')} key='1' title='hey' gameMode={GameMode.Quiz}
                       gameStatus={GameState.Ready} players={1} />
            <LobbyCard id={'6'} onClick={() => joinGame('12')} key='1' title='hey' gameMode={GameMode.Quiz}
                       gameStatus={GameState.Ready} players={1} />
            {lobbies?.map((lobby) => (
              <LobbyCard key={lobby.id}
                         id={lobby!.id!}
                         title={lobby!.name!}
                         gameMode={lobby!.mode!}
                         gameStatus={lobby!.state!}
                         players={lobby!.players!}
                         onClick={() => joinGame(lobby!.id!)} />
            ))}
          </SimpleGrid>
        </Container>
      </GridItem>
    </>
  );
};