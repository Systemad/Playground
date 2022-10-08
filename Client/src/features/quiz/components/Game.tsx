import { Box, SimpleGrid } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';

import { Answer } from '../../../components/common/AnswerButton';
import { GameScoreboard } from '../../../components/common/Scoreboard';
import { useHubConnection } from '../../../utils/api/signalr/useHubConnection';
import { QuizRuntime } from '../api/quizAPI';
import { Header } from '../components/Header';
import { useCorrectAnswer } from '../hooks/useCorrectAnswer';
import { useQuestion } from '../hooks/useQuestion';
import { buttonStatus, isButtonDisabled } from '../utils/Helper';

type Props = {
    gameId: string;
    runtime: QuizRuntime;
};
export const Game = ({ gameId, runtime }: Props) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
    const hubConnection = useHubConnection();
    const currentQuestion = useQuestion();
    //const currentAnswers = useAnswers();
    const correctAnswer = useCorrectAnswer();

    const handleAnswer = (answer: string) => {
        const isNoPreviouslySelectedAnswer = selectedAnswer === undefined;
        if (isNoPreviouslySelectedAnswer) {
            setSelectedAnswer(answer);
        }
    };

    useEffect(() => {
        const handleAnswer = async () => {
            await hubConnection?.invoke('guess', selectedAnswer, gameId);
        };
        handleAnswer();
    }, [gameId, hubConnection, selectedAnswer]);

    useEffect(() => {
        const resetAnswerListener = () => setSelectedAnswer(undefined);

        hubConnection?.on('finish-question', resetAnswerListener);
    }, [hubConnection, selectedAnswer]);

    return (
        <>
            {currentQuestion && (
                <>
                    <Header
                        currentQuestion={currentQuestion.question}
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        step={currentQuestion.number}
                        total={runtime?.numberOfQuestions}
                    />

                    <Box my={12}>
                        <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
                            {currentQuestion.answers.map((answer, index) => (
                                // TODO: Add ifficulty and category
                                <Answer
                                    key={answer}
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
                            ))}
                        </SimpleGrid>
                    </Box>

                    <GameScoreboard />
                </>
            )}
        </>
    );
};
