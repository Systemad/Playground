import { useMsal } from '@azure/msal-react';
import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Switch,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, { useContext } from 'react';

import { useAppSelector } from '../../../providers/store';
import { selectGame } from '../../../redux/quizSlice';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { LobbyPlayer, useLobbyPlayers } from '../hooks/useLobbyPlayers';
import { useUsersReady } from '../hooks/useUsersReady';

type PlayerProps = {
    player: LobbyPlayer;
};

export const QuizLobby = () => {
    const game = useAppSelector(selectGame);
    const usersReady = useUsersReady();
    const connection = useContext(socketctx);
    const usersReadyList = useLobbyPlayers();

    const { instance } = useMsal();
    const toast = useToast();

    const myId = instance.getActiveAccount()?.localAccountId;
    const isOwner = myId === game.runtime?.ownerId;
    const isMeReady = usersReadyList?.find((p) => p.id === myId)?.ready;
    const canStartGame = isMeReady && usersReady && isOwner;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('invoking handlechange');
        connection?.invoke(
            'SetPlayerStatus',
            game.runtime?.gameId,
            event.target.checked
        );
    };

    const handleStartAsync = () => {
        try {
            //if (canStartGame) {
            if (game && game.runtime?.gameId)
                connection?.invoke('start-game', game.runtime.gameId);
            //}
        } catch {
            toast({
                title: 'An error occurred',
                description:
                    'Could start the game game, not everyone is ready!',
                status: 'error',
                duration: 2500,
                isClosable: true,
            });
        }
    };

    const PlayerCard = ({ player }: PlayerProps) => {
        const isMe = myId === player?.id;
        return (
            <Center py={2}>
                <Box
                    h="150px"
                    w={'300px'}
                    bg={'gray.900'}
                    rounded={'md'}
                    px={2}
                    textAlign={'center'}
                >
                    <Box
                        w="full"
                        h="50px"
                        bg={player.ready ? 'green.700' : 'red.700'}
                        mt={2}
                        p="4"
                        fontSize={'sm'}
                        rounded={'md'}
                    >
                        {player?.ready ? 'Ready' : 'Not Ready'}
                    </Box>
                    <Heading mt="4" fontSize={'md'} fontFamily={'body'}>
                        {player?.name}
                    </Heading>

                    <HStack w="full" mb="2">
                        {isMe && (
                            <>
                                <Switch
                                    onChange={handleChange}
                                    isChecked={isMeReady}
                                    size="lg"
                                />

                                {isOwner && (
                                    <Button
                                        isDisabled={!canStartGame}
                                        borderRadius="md"
                                        bgColor="#4C566A"
                                        w="full"
                                        mx="auto"
                                        my="auto"
                                        p={6}
                                        onClick={handleStartAsync}
                                    >
                                        Start
                                    </Button>
                                )}
                            </>
                        )}
                    </HStack>
                </Box>
            </Center>
        );
    };

    return (
        <Stack
            overflow={'hidden'}
            h={'95vh'}
            direction={{ base: 'column', md: 'row' }}
        >
            <Flex flex={1} bgColor="green" align={'left'} justify={'left'}>
                <Stack
                    spacing={4}
                    h="full"
                    w={'full'}
                    bgColor="yellow"
                    maxW={'lg'}
                >
                    {usersReadyList?.map((item) => (
                        <PlayerCard key={item.id} player={item} />
                    ))}
                </Stack>
            </Flex>

            <Flex flex={1} bgColor="blue">
                aa
            </Flex>
        </Stack>
    );
};
