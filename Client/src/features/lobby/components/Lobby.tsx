import {
  Flex, GridItem, Stack,
  useDisclosure,
} from '@chakra-ui/react';

import { useLobbyGetGamesQuery } from '../api/lobbyAPI';
import { UseLobbySocket } from '../hooks/UseLobbySocket';
import { LobbyCard } from '../index';

export const LobbyLayout = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {data: lobbies} = useLobbyGetGamesQuery();
  UseLobbySocket();

  return (
    <>
      <GridItem bg='papayawhip' area={'main'}>
        <Flex
          bg="#edf3f8"
          _dark={{
            bg: "#3e3e3e",
          }}
          p={5}
          w="full"
          h="full"
          alignItems="center"
          justifyContent="center"
        >
          <Stack spacing={8} direction={['column', 'row']}>
            {lobbies?.map((lobby) => (
                <LobbyCard key={lobby.id} title={lobby!.name!} gameMode={lobby!.mode!} gameStatus={lobby!.state!} players={lobby!.players!} />
            ))}
          </Stack>
        </Flex>
      </GridItem>
    </>
  )
}