import { Box, SimpleGrid } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { Answer } from '../../../components/common/AnswerButton';
import { GameScoreboard } from '../../../components/common/Scoreboard';
import { GameContext } from '../../../contexts/GameContext';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { PlayerState, QuizRuntime } from '../api/quizAPI';
import { Header } from '../components/Header';
import { useCorrectAnswer } from '../hooks/useCorrectAnswer';
import { useQuestion } from '../hooks/useQuestion';
import { buttonStatus, isButtonDisabled } from '../utils/Helper';

type Props = {
    runtime: QuizRuntime;
    scoreboard: PlayerState[];
};
export const Game = ({ runtime, scoreboard }: Props) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
    const connection = useContext(socketctx);
    const gameId = useContext(GameContext);

    const currentQuestion = useQuestion();
    const correctAnswer = useCorrectAnswer();

    const handleAnswer = (answer: string) => {
        const isNoPreviouslySelectedAnswer = selectedAnswer === undefined;
        if (isNoPreviouslySelectedAnswer) {
            setSelectedAnswer(answer);
        }
    };

    useEffect(() => {
        const handleAnswer = async () => {
            await connection?.invoke('guess', selectedAnswer, gameId);
        };
        handleAnswer();
    }, [gameId, connection, selectedAnswer]);

    useEffect(() => {
        const resetAnswerListener = () => setSelectedAnswer(undefined);

        connection?.on('finish-question', resetAnswerListener);
    }, [connection, selectedAnswer]);

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

                    <GameScoreboard scoreboard={scoreboard} />
                </>
            )}
        </>
    );
};
