import { Box, SimpleGrid } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { Answer } from '../../../components/common/AnswerButton';
import { GameScoreboard } from '../../../components/common/Scoreboard';
import { useAppSelector } from '../../../providers/store';
import { selectGame } from '../../../redux/quizSlice';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { Header } from '../components/Header';
import { useCorrectAnswer } from '../hooks/useCorrectAnswer';
import { useQuestion } from '../hooks/useQuestion';
import { useQuizRuntime } from '../hooks/useQuizSettings';
import { useScoreboard } from '../hooks/useScoreboard';
import { buttonStatus, isButtonDisabled } from '../utils/Helper';

export const Game = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
    const connection = useContext(socketctx);
    const game = useAppSelector(selectGame);

    const runtime = useQuizRuntime();

    useScoreboard();

    const currentQuestion = useQuestion();
    const correctAnswer = useCorrectAnswer();

    const handleAnswer = (answer: string) => {
        const isNoPreviouslySelectedAnswer = selectedAnswer === undefined;
        console.log('handle answer');
        if (isNoPreviouslySelectedAnswer) {
            console.log('selected answer');
            setSelectedAnswer(answer);
        }
    };

    useEffect(() => {
        const resetAnswerListener = () => setSelectedAnswer(undefined);

        connection?.on('finish-question', resetAnswerListener);
    }, [connection, selectedAnswer]);

    useEffect(() => {
        const isSelectedAnswer = selectedAnswer !== undefined;
        if (isSelectedAnswer) {
            console.log('invoking guess: selected answer');
            connection?.invoke('guess', selectedAnswer, game?.runtime?.gameId);
        }
    }, [connection, game?.runtime?.gameId, selectedAnswer]);

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
