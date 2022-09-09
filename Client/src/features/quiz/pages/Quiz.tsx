import {
    Box,
    Flex,
    ScaleFade,
    SimpleGrid,
    Spacer,
    Stack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Answer } from '../../../components/common/AnswerButton';
import { PlayerInfo } from '../../../components/common/PlayerInfo';
import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import { Player, QuizRuntime, Result } from '../api/quizAPI';
import { Game } from '../components/Game';
import { Header } from '../components/Header';
import { PreGame } from '../components/PreGame';

const ps: Player = {
    id: '1212',
    name: 'whatevs',
};

const p2: Player = {
    id: '19191',
    name: 'nodeiaia',
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

export const Quiz = () => {
    const [gameIsReady, setGameIsReady] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const { gameId } = useParams<keyof MyParams>() as MyParams;

    useEffect(() => {
        connection.on('GameStatus', (ready: boolean) => {
            setGameIsReady(ready);
        });
    });

    if (!gameIsReady) return <PreGame />;

    return <Game />;
};
