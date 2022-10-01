import { useMsal } from '@azure/msal-react';
import {
    Box,
    Button,
    Center,
    Heading,
    HStack,
    SimpleGrid,
    Switch,
    useToast,
} from '@chakra-ui/react';
import React, { useContext } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { PlayerState } from '../api/quizAPI';
import { useCurrentGame } from '../hooks/useCurrentGame';
import { useUsersReady } from '../hooks/useUsersReady';

const readyStatus = (status?: boolean | null): string => {
    if (status === null && undefined) {
        return 'blue.700';
    } else {
        if (status === true && !undefined) return 'green.700';
        else return 'red.700';
    }
};

type PlayerProps = {
    player: PlayerState;
};

type Props = {
    scoreboard: PlayerState[];
    ownerId: string;
};
export const PreGame = ({ scoreboard, ownerId }: Props) => {
    const { instance } = useMsal();
    const toast = useToast();
    const gameId = useCurrentGame();
    const usersReady = useUsersReady();

    const myId = instance.getActiveAccount()?.localAccountId;
    const isOwner = myId === ownerId;
    const socket = useContext(SocketContext);
    const isMeReady = scoreboard?.find((p) => p.id === myId)?.ready === true;
    const canStartGame = isMeReady && usersReady && isOwner;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        socket.invoke('SetPlayerStatus', gameId, event.target.checked);
    };

    const handleStartAsync = async () => {
        try {
            //if (canStartGame) {
            await socket.invoke('StartGame', gameId);
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
            <Center py={6}>
                <Box
                    h="200px"
                    w={'300px'}
                    bg={'gray.900'}
                    rounded={'md'}
                    px={4}
                    textAlign={'center'}
                >
                    <Box
                        w="full"
                        h="50px"
                        bg={readyStatus(player?.ready)}
                        mt={4}
                        p="4"
                        fontSize={'sm'}
                        rounded={'md'}
                    >
                        {player?.ready ? 'Ready' : 'Not Ready'}
                    </Box>
                    <Heading mt="4" fontSize={'md'} fontFamily={'body'}>
                        {player?.name}
                    </Heading>

                    <HStack w="full" mt="6" mb="2">
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
        <Box textAlign="center" py={10} px={6}>
            <SimpleGrid
                borderRadius="md"
                h="full"
                columns={2}
                spacingX="40px"
                spacingY="20px"
            >
                {scoreboard?.map((item) => (
                    <PlayerCard key={item.id} player={item} />
                ))}
            </SimpleGrid>
        </Box>
    );
};
