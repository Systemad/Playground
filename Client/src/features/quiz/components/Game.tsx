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
import { GameScoreboard } from '../../../components/common/Scoreboard';
import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import {
    PlayerState,
    ProcessedQuestion,
    QuizRuntime,
    useQuizGetGameRuntimeQuery,
} from '../api/quizAPI';
import { Header } from '../components/Header';
import { useCorrectAnswer } from '../hooks/useCorrectAnswer';
import { buttonStatus, isButtonDisabled } from '../utils/Helper';

type Props = {
    gameId: string;
    runtime: QuizRuntime;
};

export const Game = ({ gameId, runtime }: Props) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();

    const correctAnswer = useCorrectAnswer();

    const handleAnswer = (answer: string) => {
        const isNoPreviouslySelectedAnswer = selectedAnswer === undefined;
        if (isNoPreviouslySelectedAnswer) {
            setSelectedAnswer(answer);
        }
    };

    useEffect(() => {
        connection.invoke('SubmitAnswer', selectedAnswer);
    }, [selectedAnswer, gameId]);

    useEffect(() => {
        const resetAnswerListener = () => setSelectedAnswer(undefined);

        connection.on('NextQuestion', resetAnswerListener);
    }, [selectedAnswer]);

    return (
        <>
            <ScaleFade initialScale={0.5} in={runtime?.active}>
                <Header
                    key={runtime?.questionStep}
                    currentQuestion={runtime?.currentQuestion?.question}
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    step={runtime!.questionStep!}
                    total={runtime?.numberOfQuestions}
                />

                <Box my={12}>
                    <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
                        {runtime?.currentQuestion?.answers?.map(
                            (answer, index) => (
                                <Answer
                                    key={index}
                                    choice={answer}
                                    colorStatus={buttonStatus(
                                        answer,
                                        selectedAnswer,
                                        correctAnswer
                                    )}
                                    selected={
                                        answer === selectedAnswer ? true : false
                                    }
                                    isDisabled={isButtonDisabled(
                                        answer,
                                        selectedAnswer,
                                        correctAnswer
                                    )}
                                    onClick={handleAnswer}
                                />
                            )
                        )}
                    </SimpleGrid>
                </Box>
            </ScaleFade>

            <GameScoreboard scoreboard={runtime.scoreboard} />
        </>
    );
};
