import { Box, SimpleGrid } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { Answer } from '../components/common/AnswerButton';
import { Header } from '../features/quiz/components/Header';
import { buttonStatus, isButtonDisabled } from '../features/quiz/utils/Helper';

/*
 */

export type ProcessedQuestion = {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    number: number;
    answers: string[];
};

const question1: ProcessedQuestion = {
    category: 'swe',
    type: 'multiple',
    difficulty: 'hard',
    question: 'qeustion 1',
    number: 1,
    answers: ['ans1', 'ans2', 'ans3', 'ans4'],
};
export const Test = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();

    const correctAnswer = undefined;

    const handleAnswer = (answer: string) => {
        const isNoPreviouslySelectedAnswer = selectedAnswer === undefined;
        if (isNoPreviouslySelectedAnswer) {
            setSelectedAnswer(answer);
        }
    };

    useEffect(() => {
        return () => {
            setSelectedAnswer(undefined);
        };
    });

    return (
        <>
            {question1 && (
                <>
                    <Header
                        currentQuestion={question1.question}
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        step={question1.number}
                        total={10}
                    />

                    <Box my={12}>
                        <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
                            {question1.answers.map((answer, index) => (
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
                </>
            )}
        </>
    );
};
