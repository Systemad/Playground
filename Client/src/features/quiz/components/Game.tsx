import { Grid, GridItem, SimpleGrid } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { Answer } from '../../../components/common/AnswerButton';
import { Chatbox, GameScoreboard } from '../../../components/common/Scoreboard';
import { useAppSelector } from '../../../providers/store';
import { selectGame } from '../../../redux/quizSlice';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { Header } from '../components/Header';
import { useCorrectAnswer } from '../hooks/useCorrectAnswer';
import { useQuestion } from '../hooks/useQuestion';
import { useScoreboard } from '../hooks/useScoreboard';
import { buttonStatus, isButtonDisabled } from '../utils/Helper';

export const Game = () => {
    useScoreboard();

    const connection = useContext(socketctx);
    const game = useAppSelector(selectGame);

    const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();

    useQuestion();
    const correctAnswer = useCorrectAnswer();

    const handleAnswer = (answer: string) => {
        const isNoPreviouslySelectedAnswer = selectedAnswer === undefined;
        const isSelectedAnswer = selectedAnswer !== undefined;

        if (isNoPreviouslySelectedAnswer) {
            setSelectedAnswer(answer);

            connection?.invoke(
                'guess-answer',
                selectedAnswer,
                game?.runtime?.gameId
            );
        }
    };

    useEffect(() => {
        const resetAnswerListener = () => setSelectedAnswer(undefined);

        connection?.on('finish-question', resetAnswerListener);
    }, [connection]);

    return (
        <>
            {game.runtime?.currentQustion ? (
                <>
                    <Grid
                        templateAreas={'"score main chat"'}
                        gridTemplateRows={'90vh'}
                        gridTemplateColumns={'1fr 3fr 1fr'}
                        gap="4"
                    >
                        <GridItem
                            rounded={'md'}
                            area={'score'}
                            bg="cupcake.base200"
                        >
                            <GameScoreboard />
                        </GridItem>
                        <GridItem
                            p="0.35rem"
                            rounded={'md'}
                            area={'main'}
                            bg="cupcake.base200"
                        >
                            <Header
                                currentQuestion={
                                    game.runtime?.currentQustion.question
                                }
                                step={game.runtime?.currentQustion.number}
                                total={game.runtime?.numberOfQuestions}
                                category={game.runtime?.currentQustion.category}
                                difficulty={
                                    game.runtime?.currentQustion.difficulty
                                }
                            />

                            <SimpleGrid
                                columns={[1, 2]}
                                my="1rem"
                                spacing={[4, 8]}
                            >
                                {game.runtime?.currentQustion.answers.map(
                                    (answer, index) => (
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
                        </GridItem>
                        <GridItem
                            rounded={'md'}
                            area={'chat'}
                            bg="cupcake.base200"
                        >
                            <Chatbox />
                        </GridItem>
                    </Grid>
                </>
            ) : (
                'Erorr question'
            )}
        </>
    );
};
