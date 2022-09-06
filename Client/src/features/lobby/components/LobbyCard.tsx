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

import { GameMode, GameState } from '../../enums';
import { GameStatusButton } from './GameStatusButton';

type Props = {
    name?: string;
    gameMode?: GameMode;
    players?: number;
    gameStatus?: GameState;
    difficulty?: string;
    onClick: () => void;
};

export const LobbyCard = ({
    name,
    gameMode,
    players,
    gameStatus,
    difficulty,
    onClick,
}: Props) => {
    let diff;
    let amount;

    const badgeColor = useColorModeValue('gray.50', 'gray.800');
    if (difficulty) {
        diff = (
            <Badge px={2} py={1} bg={badgeColor} fontWeight={'400'}>
                {difficulty}
            </Badge>
        );
    }

    const winner = 'winner1';
    const me = 'me'; // get info from MSAL
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const amIwinner = winner === me;

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
                    <Avatar
                        size="md"
                        src={
                            'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                        }
                    />
                    <Avatar
                        size="md"
                        src={
                            'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                        }
                    />
                    <Avatar
                        size="md"
                        src={
                            'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                        }
                    />
                    <Avatar
                        size="md"
                        src={
                            'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                        }
                    />
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
                    <Text
                        textAlign={'center'}
                        color={amIwinner ? 'red' : 'green'}
                        px={3}
                        fontSize="xl"
                    >
                        {amIwinner ? 'WIN' : 'LOSS'}
                    </Text>
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
                            Quiz
                        </Badge>
                        {diff}
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
                            onClick={() => onClick()}
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
