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

import { GameContext } from '../../../contexts/GameContext';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { useUsersReady } from '../hooks/useUsersReady';
import { PlayerReadyData, useUsersReadyList } from '../hooks/useUsersReadyList';

type PlayerProps = {
    player: PlayerReadyData;
};

type Props = {
    ownerId?: string;
};
export const PreGame = ({ ownerId }: Props) => {
    const { instance } = useMsal();
    const toast = useToast();
    const usersReady = useUsersReady();
    const gameId = useContext(GameContext);
    const connection = useContext(socketctx);
    const myId = instance.getActiveAccount()?.localAccountId;
    const isOwner = myId === ownerId;

    const usersReadyList = useUsersReadyList();

    const isMeReady = usersReadyList?.find((p) => p.id === myId)?.ready;
    const canStartGame = isMeReady && usersReady && isOwner;

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await connection?.invoke(
            'SetPlayerStatus',
            gameId,
            event.target.checked
        );
    };

    const handleStartAsync = async () => {
        try {
            //if (canStartGame) {
            await connection?.invoke('start-game', gameId);
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
                        bg={player.ready ? 'green.700' : 'red.700'}
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
                {usersReadyList?.map((item) => (
                    <PlayerCard key={item.id} player={item} />
                ))}
            </SimpleGrid>
        </Box>
    );
};
