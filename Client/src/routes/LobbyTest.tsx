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

import { LobbyPlayer } from '../features/quiz/hooks/useLobbyPlayers';

const player1: LobbyPlayer = {
    id: '1',
    name: 'Dan',
    ready: true,
};

const player2: LobbyPlayer = {
    id: '2',
    name: 'Josef',
    ready: true,
};

const player3: LobbyPlayer = {
    id: '3',
    name: 'Tugs',
    ready: false,
};

const player4: LobbyPlayer = {
    id: '4',
    name: 'Panos',
    ready: false,
};

const lobbyPlayers = [player1, player2, player3, player4];
type PlayerProps = {
    player: LobbyPlayer;
};

export const LobbyTest = () => {
    const { instance } = useMsal();
    const toast = useToast();

    const isOwner = true;
    const canStartGame = true;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //
    };

    const handleStartAsync = () => {
        ///
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
                        Difficulty: Hard
                    </Text>
                    <Text textColor="cupcake.primarycontent" fontSize={'2xl'}>
                        Category: Sports
                    </Text>
                    <Text textColor="cupcake.primarycontent" fontSize={'2xl'}>
                        Questions: 10
                    </Text>
                </VStack>
            </Center>
        );
    };

    const PlayerCard = ({ player }: PlayerProps) => {
        const isMe = true;
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
                                    isChecked={true}
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
        <SimpleGrid borderRadius="md" columns={2} spacing={8} p="0.35rem">
            <SimpleGrid columns={2} spacing={4} h="full">
                {lobbyPlayers?.map((item) => (
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
