import {
    Box,
    Flex,
    ScaleFade,
    SimpleGrid,
    Spacer,
    Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Answer } from '../../../components/common/AnswerButton';
import { PlayerInfo } from '../../../components/common/PlayerInfo';
import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import { Player, QuizRuntime, Result } from '../api/quizAPI';
import { Header } from '../components/Header';

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

export const Game = () => {
    const [disabled, setDisabled] = useState<boolean>(false);
    const { gameId } = useParams<keyof MyParams>() as MyParams;

    /*
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {data: quiz} = useQuizGetGameRuntimeQuery({gameId: gameId});
  */

    const handleAnswer = async (answer: string) => {
        await connection.invoke('submitAnswer', answer);
    };

    /*
    connection.on("NextQuestion", (question: Result) => {
      setDisabled(false);
    })

    UseQuizSocket(gameId)
  */
    return (
        <>
            <ScaleFade initialScale={0.5} in={quiz.gameActive}>
                <Header
                    key={quiz?.questionStep}
                    currentQuestion={quiz?.currentQuestion?.question}
                    step={quiz?.questionStep}
                    total={quiz?.questions}
                />

                <Box my={12}>
                    <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
                        {quiz?.currentQuestion?.incorrect_answers?.map(
                            (answer, index) => {
                                return (
                                    <Answer
                                        choice={answer}
                                        key={index + answer}
                                        onClick={() => handleAnswer(answer)}
                                        isDisabled={disabled}
                                    >
                                        {answer}
                                    </Answer>
                                );
                            }
                        )}
                    </SimpleGrid>
                </Box>
            </ScaleFade>

            <PlayerInfo gameId={gameId} />
        </>
    );
};
