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
import { useScoreboard } from '../hooks/useScoreboard';
import { buttonStatus, isButtonDisabled } from '../utils/Helper';

// This somehow causes rerender?? of parent
export const Game = () => {
    useScoreboard();

    const connection = useContext(socketctx);
    const game = useAppSelector(selectGame);

    const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();

    useQuestion();
    const correctAnswer = useCorrectAnswer();

    const usersAnswered = game.runtime?.scoreboard.find((v) => v.answered);

    const handleAnswer = (answer: string) => {
        const isNoPreviouslySelectedAnswer = selectedAnswer === undefined;
        const isSelectedAnswer = selectedAnswer !== undefined;

        console.log('handle answer');
        if (isNoPreviouslySelectedAnswer) {
            setSelectedAnswer(answer);
            console.log('invoking guess: selected answer');
            connection?.invoke(
                'guess-answer',
                selectedAnswer,
                game?.runtime?.gameId
            );

            console.log('selected answer');
        }
    };

    useEffect(() => {
        const resetAnswerListener = () => setSelectedAnswer(undefined);

        connection?.on('finish-question', resetAnswerListener);
    }, [connection]);

    /*
    useEffect(() => {
        const isSelectedAnswer = selectedAnswer !== undefined;
        if (isSelectedAnswer) {
            console.log('invoking guess: selected answer');
            connection?.invoke('guess', selectedAnswer, game?.runtime?.gameId);
        }
    }, [connection, game?.runtime?.gameId, selectedAnswer]);
    */
    return (
        <>
            {game.runtime?.currentQustion ? (
                <>
                    <Header
                        currentQuestion={game.runtime?.currentQustion.question}
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        step={game.runtime?.currentQustion.number}
                        total={game.runtime?.numberOfQuestions}
                    />

                    <Box my={12}>
                        <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
                            {game.runtime?.currentQustion.answers.map(
                                (answer, index) => (
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
                                            answer === selectedAnswer
                                                ? true
                                                : false
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
                    <GameScoreboard />
                </>
            ) : (
                'Erorr question'
            )}
        </>
    );
};

//                     <GameScoreboard />
