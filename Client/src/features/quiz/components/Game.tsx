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
import { Scoreboard } from '../../../components/common/Scoreboard';
import connection from '../../../utils/api/signalr/Socket';
import { MyParams } from '../../../utils/routerParams';
import {
    ProcessedQuestion,
    Runtime,
    useQuizGetGameRuntimeQuery,
} from '../api/quizAPI';
import { Header } from '../components/Header';
import { useCorrectAnswer } from '../hooks/useCorrectAnswer';
import { buttonStatus, isButtonDisabled } from '../utils/Helper';

export const Game = () => {
    const { gameId } = useParams<keyof MyParams>() as MyParams;
    const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();

    const correctAnswer = useCorrectAnswer();

    //const { isOpen, onOpen, onClose } = useDisclosure()
    const { data: quiz } = useQuizGetGameRuntimeQuery({ gameId: gameId });

    const handleAnswer = (answer: string) => {
        const isNoPreviouslySelectedAnswer = selectedAnswer === undefined;
        if (isNoPreviouslySelectedAnswer) {
            setSelectedAnswer(answer);
        }
    };

    useEffect(() => {
        connection.invoke('SubmitAnswer', selectedAnswer);
    }, [selectedAnswer]);

    useEffect(() => {
        const resetAnswerListener = () => setSelectedAnswer(undefined);

        connection.on('SubmitAnswer', resetAnswerListener);
    }, [selectedAnswer]);

    /*
    connection.on("NextQuestion", (question: Result) => {
      setDisabled(false);
    })

    UseQuizSocket(gameId)
  */
    return (
        <>
            <ScaleFade initialScale={0.5} in={quiz?.gameActive}>
                <Header
                    key={quiz?.questionStep}
                    currentQuestion={quiz?.currentQuestion?.question}
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    step={quiz!.questionStep!}
                    total={quiz?.questions}
                />

                <Box my={12}>
                    <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
                        {quiz?.currentQuestion?.answers?.map(
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

            <Scoreboard gameId={gameId} />
        </>
    );
};
