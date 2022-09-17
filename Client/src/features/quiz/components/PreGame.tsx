import { useMsal } from '@azure/msal-react';
import {
    Box,
    Center,
    Heading,
    SimpleGrid,
    Switch,
    Text,
} from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom';

import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import { PlayerRuntime, useQuizGetGameScoreboardQuery } from '../api/quizAPI';
import { usePreGame } from '../hooks/usePreGame';

type Props = {
    player?: PlayerRuntime;
};
export const PreGame = () => {
    const { gameId } = useParams<keyof MyParams>() as MyParams;
    const { data } = useQuizGetGameScoreboardQuery({ gameId: gameId });

    const { instance } = useMsal();
    usePreGame(gameId);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log(event.target.checked);
        connection.invoke('SetPlayerStatus', gameId, event.target.checked);
    };

    const PlayerCard = ({ player }: Props) => {
        const myId = instance.getActiveAccount()?.localAccountId;
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
                        bg={player?.ready ? 'green.700' : 'red.700'}
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

                    {isMe && (
                        <>
                            <Switch
                                onChange={handleChange}
                                size="lg"
                                w="full"
                                mt="6"
                                mb="2"
                            />
                            <Text fontSize="lg">Ready up</Text>
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
                {data?.players?.map((item) => (
                    <PlayerCard key={item.id} player={item} />
                ))}
            </SimpleGrid>
        </Box>
    );
};
