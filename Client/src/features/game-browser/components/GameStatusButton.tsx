import { Box, chakra, Flex, Icon } from '@chakra-ui/react';
import { BsLightningFill } from 'react-icons/all';

import { GameStatus } from '../api/lobbyAPI';

type Props = {
    gameStatus?: GameStatus;
    players?: number;
};

export const GameStatusButton = ({ gameStatus, players }: Props) => {
    let button;

    switch (gameStatus) {
        case 'AwaitingPlayers':
            button = <Icon as={BsLightningFill} color="red" boxSize={6} />;
            break;
        case 'Ready':
            button = <Icon as={BsLightningFill} color="red" boxSize={6} />;
            break;
        case 'Finished':
            button = <Icon as={BsLightningFill} color="red" boxSize={6} />;
            break;
        case 'Canceled':
            button = <Icon as={BsLightningFill} color="red" boxSize={6} />;
            break;
        case 'InProgress':
            button = <Icon as={BsLightningFill} color="red" boxSize={6} />;
            break;
        default:
            button = <Icon as={BsLightningFill} color="red" boxSize={6} />;
    }

    return (
        <Flex
            maxW="sm"
            w="full"
            bg="gray.400"
            _dark={{
                bg: 'gray.200',
            }}
            rounded="lg"
            overflow="hidden"
            maxH="40px"
        >
            <Flex
                justifyContent="center"
                alignItems="center"
                w={12}
                bg="green.500"
            >
                {button}
            </Flex>

            <Box mx={-3} py={2} px={4}>
                <Box mx={3}>
                    <chakra.span
                        color="white"
                        _dark={{
                            color: 'black.400',
                        }}
                        fontWeight="bold"
                    >
                        {gameStatus && `${gameStatus} - ${players} / 4}`}
                    </chakra.span>
                </Box>
            </Box>
        </Flex>
    );
};
