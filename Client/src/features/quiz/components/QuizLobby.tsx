import { useMsal } from '@azure/msal-react';
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    Switch,
    Text,
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

    const GameInfo = () => {
        return (
            <Center>
                <VStack>
                    <Text textColor="cupcake.primarycontent" fontSize={'3xl'}>
                        Game Info
                    </Text>
                    <Divider bgColor="gray.800" />
                    <Text textColor="cupcake.primarycontent" fontSize={'2xl'}>
                        Game Mode: Quiz
                    </Text>
                    <Text textColor="cupcake.primarycontent" fontSize={'2xl'}>
                        Difficulty: {game.runtime?.settings.difficulty}
                    </Text>
                    <Text textColor="cupcake.primarycontent" fontSize={'2xl'}>
                        Category: {game.runtime?.settings.category}
                    </Text>
                    <Text textColor="cupcake.primarycontent" fontSize={'2xl'}>
                        Questions: {game.runtime?.settings.questions}
                    </Text>
                </VStack>
            </Center>
        );
    };

    const PlayerCard = ({ player }: PlayerProps) => {
        const isMe = myId === player?.id;
        return (
            <Center borderColor="black">
                <Box
                    h="150px"
                    w={'300px'}
                    bg={'cupcake.altbase200'}
                    rounded={'md'}
                    px="0.35rem"
                    boxShadow={'md'}
                    textAlign={'center'}
                >
                    <Box
                        w="full"
                        h="50px"
                        bg={player.ready ? 'cupcake.success' : 'cupcake.error'}
                        mt={2}
                        p="4"
                        fontSize={'sm'}
                        rounded={'md'}
                    >
                        {player?.ready ? 'Ready' : 'Not Ready'}
                    </Box>
                    <Heading
                        my={2}
                        color="cupcake.primarycontent"
                        fontSize={'md'}
                        fontFamily={'body'}
                    >
                        {player?.name}
                    </Heading>

                    <HStack w="full" justifyContent="space-evenly">
                        {isMe && (
                            <>
                                <Switch
                                    onChange={handleChange}
                                    isChecked={player.ready}
                                    size="lg"
                                />

                                {isOwner && (
                                    <Button
                                        isDisabled={!canStartGame}
                                        borderRadius="md"
                                        bgColor="cupcake.base200"
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
        <SimpleGrid borderRadius="md" columns={2} spacing={8} p="0.35rem">
            <SimpleGrid columns={2} spacing={4} h="full">
                {usersReadyList?.map((item) => (
                    <PlayerCard key={item.id} player={item} />
                ))}
            </SimpleGrid>
            <Box
                h="full"
                w={'20rem'}
                borderRadius="md"
                boxShadow={'md'}
                bg={'cupcake.altbase200'}
            >
                <GameInfo />
            </Box>
        </SimpleGrid>
    );
};
