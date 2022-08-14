import { Box, Flex, GridItem, Stack, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { GameMode, GameState } from '../../enums';
import { useLobbyGetGamesQuery } from '../api/lobbyAPI';
import { LobbyCard } from '../components/LobbyCard';
import { UseLobbySocket } from '../hooks/UseLobbySocket';

export const LobbyLayout = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {data: lobbies} = useLobbyGetGamesQuery();
  const navigate = useNavigate();

  UseLobbySocket();

  const joinGame = (id: string): void => {
    console.log("haha")
    //navigate(`quiz/${id}`);
  }

  return (
    <>
      <GridItem area={'main'}>
          <Flex
            bg="#edf3f8"
            p={5}
            w='full'
          >
            <Stack spacing={8}>
              <LobbyCard id={"1"} onClick={() => joinGame("12")} key="1" title="hey" gameMode={GameMode.Quiz} gameStatus={GameState.Ready} players={1} />
              {lobbies?.map((lobby) => (
                  <LobbyCard key={lobby.id}
                             id={lobby!.id!}
                             title={lobby!.name!}
                             gameMode={lobby!.mode!}
                             gameStatus={lobby!.state!}
                             players={lobby!.players!}
                             onClick={() => joinGame(lobby!.id!)}/>
              ))}
            </Stack>
          </Flex>
      </GridItem>
    </>
  )
}