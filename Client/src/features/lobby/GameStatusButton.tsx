import { Box, Button, chakra,Flex, Icon } from '@chakra-ui/react';
import { BsLightningFill, IoMdAlert,IoMdCheckmarkCircle } from 'react-icons/all';

type Props = {
  gameStatus: string,
  players: string,
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
          {gameStatus === "full" &&
            <Icon as={BsLightningFill} color="white" boxSize={6} />
          }
          {gameStatus === "awaitingPlayers" &&
            <Icon as={IoMdAlert} color="white" boxSize={6} />
          }
          {gameStatus === "inprogress" &&
            <Icon as={IoMdAlert} color="white" boxSize={6} />
          }
          {gameStatus === "ready" &&
            <Icon as={IoMdCheckmarkCircle} color="white" boxSize={6} />
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
              {gameStatus} - {players}
            </chakra.span>
          </Box>
        </Box>
    </Flex>
  );
}