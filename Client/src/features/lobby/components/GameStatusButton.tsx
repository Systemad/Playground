import { Box, chakra, Flex, Icon } from '@chakra-ui/react';
import { BsLightningFill, IoMdAlert, IoMdCheckmarkCircle } from 'react-icons/all';

import { GameState } from '../../enums';

type Props = {
  gameStatus: GameState,
  players: number,
}

export const GameStatusButton = ({ gameStatus, players }: Props) => {

  let button;

  switch (gameStatus) {
    case GameState.AwaitingPlayers:
      button = <Icon as={BsLightningFill} color='red' boxSize={6} />;
      break;
    case GameState.Ready:
      button = <Icon as={BsLightningFill} color='red' boxSize={6} />;
      break;
    case GameState.Finished:
      button = <Icon as={BsLightningFill} color='red' boxSize={6} />;
      break;
    case GameState.Canceled:
      button = <Icon as={BsLightningFill} color='red' boxSize={6} />;
      break;
    case GameState.InProgress:
      button = <Icon as={BsLightningFill} color='red' boxSize={6} />;
      break;
    default:
      button = <Icon as={BsLightningFill} color='red' boxSize={6} />;

  }

  return (
    <Flex
      maxW='sm'
      w='full'
      bg='gray.400'
      _dark={{
        bg: 'gray.200',
      }}
      rounded='lg'
      overflow='hidden'
      maxH="40px"
    >
      <Flex justifyContent='center' alignItems='center' w={12} bg='green.500'>
        {button}
      </Flex>

      <Box mx={-3} py={2} px={4}>
        <Box mx={3}>
          <chakra.span
            color='white'
            _dark={{
              color: 'black.400',
            }}
            fontWeight='bold'
          >
            {GameState[gameStatus]} - {players} / {'4'}
          </chakra.span>
        </Box>
      </Box>
    </Flex>
  );
};