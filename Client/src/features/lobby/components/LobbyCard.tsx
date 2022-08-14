import {
  Box,
  Button,
  chakra,
  Flex,
} from '@chakra-ui/react';

import { Difficulty, GameMode, GameState } from '../../enums';
import { GameStatusButton } from './GameStatusButton';

type Props = {
  title: string,
  id: string,
  gameMode: GameMode,
  players: number,
  gameStatus: GameState,
  difficulty?: Difficulty,
  onClick: (id: string) => any,
}
export const LobbyCard = ({ title, id, gameMode, players, gameStatus, difficulty, onClick }: Props) => {

  return (
    <>
      <Box
        mx='auto'
        px={8}
        py={4}
        rounded='lg'
        shadow='lg'
        bg='white'
        _dark={{
          bg: 'gray.800',
        }}
        w='350px'
      >
        <Flex justifyContent='space-between' alignItems='center'>
          <chakra.span
            fontWeight='700'
            fontSize='xl'
            color='gray.600'
            _dark={{
              color: 'gray.400',
            }}
          >
            {title}
          </chakra.span>
          <Flex>
            {difficulty &&
              <>
                <Box
                  px={3}
                  py={1}
                  bg='gray.600'
                  color='gray.100'
                  fontSize='sm'
                  fontWeight='700'
                  rounded='md'
                >
                  {difficulty.toString()}
                </Box>
              </>
            }

            <Box
              px={3}
              py={1}
              bg='gray.600'
              color='gray.100'
              fontSize='sm'
              fontWeight='700'
              rounded='md'
            >
              {GameMode[gameMode]}
            </Box>
          </Flex>
        </Flex>

        <Flex justifyContent='space-between' alignItems='center' mt={4}>
          <GameStatusButton gameStatus={gameStatus} players={players} />
          <Button textTransform="uppercase" colorScheme='teal' size='md' onClick={() => onClick(id)}>
            Join
          </Button>
        </Flex>
      </Box>
    </>
  );
};