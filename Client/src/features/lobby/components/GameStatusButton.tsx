import { Box, chakra, Flex, Icon } from '@chakra-ui/react';
import { BsLightningFill, IoMdAlert, IoMdCheckmarkCircle } from 'react-icons/all';

import { GameState } from '../../enums';

type Props = {
  gameStatus: GameState,
  players: number,
}

export const GameStatusButton = ({gameStatus, players} : Props) => {

  return (
      <Flex
        maxW="sm"
        w="full"
        bg="gray.400"
        _dark={{
          bg: "gray.200",
        }}
        rounded="lg"
        overflow="hidden"
      >
        <Flex justifyContent="center" alignItems="center" w={12} bg="green.500">
          {gameStatus === GameState.InProgress &&
            <Icon as={BsLightningFill} color="red" boxSize={6} />
          }
          {gameStatus === GameState.AwaitingPlayers &&
            <Icon as={IoMdAlert} color="green" boxSize={6} />
          }
          {gameStatus === GameState.Ready &&
            <Icon as={IoMdCheckmarkCircle} color="green" boxSize={6} />
          }
        </Flex>

        <Box mx={-3} py={2} px={4}>
          <Box mx={3}>
            <chakra.span
              color="white"
              _dark={{
                color: "black.400",
              }}
              fontWeight="bold"
            >
              {GameState[gameStatus]} - {players} / {"3"}
            </chakra.span>
          </Box>
        </Box>
    </Flex>
  );
}