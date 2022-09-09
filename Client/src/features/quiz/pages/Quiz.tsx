import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MyParams } from '../../../utils/routerParams';
import {
    Player,
    QuizRuntime,
    Result,
    useQuizGetGameRuntimeQuery,
} from '../api/quizAPI';
import { Game } from '../components/Game';
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
    gameActive: false,
    currentQuestion: qs,
    questions: 10,
    questionStep: 1,
    numberOfPlayers: 2,
    players: [ps, p2],
};

// TODO: When game ends, navigate to gameid/results
export const Quiz = () => {
    const [disabled, setDisabled] = useState<boolean>(false);
    const { gameId } = useParams<keyof MyParams>() as MyParams;

    const { data: game } = useQuizGetGameRuntimeQuery({ gameId: gameId });

    if (!quiz.gameActive) return <PreGame />;

    return <Game />;
};
