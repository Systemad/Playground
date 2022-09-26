import { useMsal } from '@azure/msal-react';
import {
    Box,
    Center,
    Heading,
    HStack,
    SimpleGrid,
    Switch,
    useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import connection from '../../../utils/api/signalr/Socket';
import { PlayerState } from '../api/quizAPI';
import { usePreGame } from '../hooks/usePreGame';
import { ReadyButton } from './ReadyButton';

const readyStatus = (status?: boolean | null): string => {
    if (status === null && undefined) {
        return 'blue.700';
    } else {
        if (status === true && !undefined) return 'green.700';
        else return 'red.700';
    }
};

type Props = {
    gameId: string;
    ownerId?: string;
    scoreboard?: PlayerState[];
};
type PlayerProps = {
    player?: PlayerState;
};
export const PreGame = ({ gameId, ownerId, scoreboard }: Props) => {
    usePreGame(gameId);

    const toast = useToast();
    const { instance } = useMsal();
    const myId = instance.getActiveAccount()?.localAccountId;
    const isOwner = myId === ownerId;
    const isMeReady = scoreboard?.find((p) => p.id === myId)?.ready === true;
    const [ready, setReady] = useState<boolean>(false);
    const canStartGame = isMeReady && ready && isOwner;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        connection.invoke('SetPlayerStatus', gameId, event.target.checked);
    };

    useEffect(() => {
        connection.invoke('JoinGame', gameId);
    }, [gameId]);

    useEffect(() => {
        connection.on('AllUsersReady', () => {
            setReady(true);
        });
    }, []);

    const handleStartAsync = async () => {
        try {
            if (canStartGame) {
                await connection.invoke('StartGame', gameId);
            }
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

                    {isMe && canStartGame && (
                        <>
                            <HStack w="full" mt="6" mb="2">
                                <Switch
                                    defaultChecked={false}
                                    onChange={handleChange}
                                    isChecked={isMeReady}
                                    size="lg"
                                />
                                <ReadyButton
                                    onClick={handleStartAsync}
                                    canStart={canStartGame}
                                />
                            </HStack>
                        </>
                    )}
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
