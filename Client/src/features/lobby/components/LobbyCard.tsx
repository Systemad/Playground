import {
    Avatar,
    Badge,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Link,
    SimpleGrid,
    Stack,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';

import { GameMode, GameStatus } from '../api/lobbyAPI';
import { GameStatusButton } from './GameStatusButton';

export interface Color {
    id: string;
    name: string;
}

const colors = [
    'red',
    'blue',
    'yellow',
    'green',
    'pink',
    'purple',
    'teal',
    'orange',
];

type Props = {
    id: string;
    name: string;
    gameMode: GameMode;
    players: number;
    gameStatus: GameStatus;
    difficulty?: string;
    onClick: (id: string) => void;
};

export const LobbyCard = ({
    id,
    name,
    gameMode,
    players,
    gameStatus,
    difficulty,
    onClick,
}: Props) => {
    let bubbles;

    const badgeColor = useColorModeValue('gray.50', 'gray.800');

    if (players) {
        const shuffled = [...colors].sort(() => 0.5 - Math.random());
        const shuffledColors = shuffled.slice(0, players);

        bubbles = Array(players)
            .fill(1)
            .map((el, i) => (
                <Avatar
                    key={el}
                    size="md"
                    src={''}
                    color={`${shuffledColors[i]}.700`}
                />
            ));
    }

    return (
        <Center py={6}>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                w={{ sm: '100%', md: '540px' }}
                height={{ sm: '476px', md: '15rem' }}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'md'}
                padding={4}
            >
                <SimpleGrid
                    w="125px"
                    maxW="125px"
                    alignContent="center"
                    columns={2}
                    spacing={5}
                    p="3"
                >
                    {bubbles}
                </SimpleGrid>

                <Stack
                    flex={1}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={1}
                    pt={2}
                >
                    <Heading fontSize={'2xl'} fontFamily={'body'}>
                        {name}
                    </Heading>
                    <Stack
                        align={'center'}
                        justify={'center'}
                        direction={'row'}
                        mt={6}
                    >
                        <Badge
                            px={2}
                            py={1}
                            bg={useColorModeValue('gray.50', 'gray.800')}
                            fontWeight={'400'}
                        >
                            {gameMode}
                        </Badge>

                        <Badge
                            px={2}
                            py={1}
                            bg={useColorModeValue('gray.50', 'gray.800')}
                            fontWeight={'400'}
                        >
                            {gameStatus}
                        </Badge>
                        {difficulty && (
                            <Badge
                                px={2}
                                py={1}
                                bg={badgeColor}
                                fontWeight={'400'}
                            >
                                {difficulty}
                            </Badge>
                        )}
                    </Stack>

                    <Stack
                        width={'100%'}
                        mt={'2rem'}
                        direction={'row'}
                        padding={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Button
                            onClick={() => onClick(id)}
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            _focus={{
                                bg: 'gray.200',
                            }}
                        >
                            Join
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Center>
    );
};
