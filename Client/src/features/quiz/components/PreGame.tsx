import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    ScaleFade,
    SimpleGrid,
    Spacer,
    Stack,
    Switch,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Answer } from '../../../components/common/AnswerButton';
import { PlayerInfo } from '../../../components/common/PlayerInfo';
import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import {
    Player,
    PlayerRuntime,
    QuizRuntime,
    quizSplitApi,
    Result,
    useQuizGetGameRuntimeQuery,
    useQuizGetGameScoreboardQuery,
} from '../api/quizAPI';
import { usePreGame } from '../hooks/usePreGame';
import { Header } from './Header';

/*
export type PlayerRuntime = {
    id?: string;
    name?: string;
    score?: number;
    answered?: boolean;
    ready?: boolean;
};
*/
const ps: PlayerRuntime = {
    id: '1212',
    name: 'whatevs',
    ready: true,
};

const p2: PlayerRuntime = {
    id: '19191',
    name: 'nodeiaia',
    ready: false,
};

const qs: Result = {
    category: 'Tech',
    type: 'noidea',
    difficulty: 'easy',
    question: 'Who won Hockey',
    correct_answer: 'Sweden',
    incorrect_answers: ['Sweden', 'Finland', 'USA', 'Canada'],
};

const quiz: QuizRuntime = {
    gameActive: true,
    currentQuestion: qs,
    questions: 10,
    questionStep: 1,
    numberOfPlayers: 2,
    players: [ps, p2],
};

type Props = {
    player?: PlayerRuntime;
};
export const PreGame = () => {
    const { gameId } = useParams<keyof MyParams>() as MyParams;
    const { data: players } = useQuizGetGameScoreboardQuery({ gameId: gameId });

    usePreGame(gameId);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log(event.target.checked);
        connection.invoke('PlayerReady', event.target.checked);
    };

    const PlayerCard = ({ player }: Props) => {
        const myId = '1212';

        const isMe = myId === player?.id;

        let status;

        if (player?.ready) {
            status = (
                <Box
                    w="full"
                    h="50px"
                    bg="green.700"
                    mt={6}
                    p="4"
                    fontSize={'sm'}
                    rounded={'md'}
                >
                    Ready
                </Box>
            );
        } else {
            status = (
                <Box
                    w="full"
                    h="50px"
                    bg="red.700"
                    mt={6}
                    p="4"
                    fontSize={'sm'}
                    rounded={'md'}
                >
                    Not Ready
                </Box>
            );
        }
        return (
            <Box
                h="200px"
                w={'300px'}
                bg={'blue.700'}
                rounded={'md'}
                px={4}
                textAlign={'center'}
            >
                <VStack direction={'row'} align={'center'}>
                    {status}
                    <Heading mt="8" fontSize={'md'} fontFamily={'body'}>
                        {player?.name}
                    </Heading>

                    {isMe && (
                        <Switch
                            onChange={handleChange}
                            size="lg"
                            w="full"
                            mt="8"
                        >
                            Ready
                        </Switch>
                    )}
                </VStack>
            </Box>
        );
    };

    return (
        <Flex
            borderRadius="md"
            position="absolute"
            top="35%"
            left="35%"
            alignContent={'center'}
            justifyContent={'center'}
        >
            <SimpleGrid columns={2} spacing={10}>
                {quiz?.players?.map((item, index) => (
                    <PlayerCard key={index} player={item} />
                ))}
            </SimpleGrid>
        </Flex>
    );
};
