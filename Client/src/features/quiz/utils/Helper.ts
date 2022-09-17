export const buttonStatus = (
    thisAnswer: string,
    selectedAnswer: string | undefined,
    correctAnswer: string | undefined
): string => {
    const isSelectedAnswer = thisAnswer === selectedAnswer;
    const answerIsCorrect = thisAnswer === correctAnswer;
    const answerIsIncorrect =
        correctAnswer !== undefined && correctAnswer !== thisAnswer;

    if (answerIsCorrect) {
        return 'green.700';
    } else if (isSelectedAnswer && answerIsIncorrect) {
        return 'red.700';
    } else if (isSelectedAnswer) {
        return 'blue.700';
    } else {
        return 'gray.500';
    }
};

export const isButtonDisabled = (
    thisAnswer: string,
    selectedAnswer: string | undefined,
    correctAnswer: string | undefined
): boolean => {
    const answerHasBeenSelected = selectedAnswer !== undefined;
    const isSelectedAnswer = thisAnswer === selectedAnswer;
    const isCorrectAnswer = thisAnswer === correctAnswer;
    if (answerHasBeenSelected) {
        if (isSelectedAnswer) {
            return false;
        } else if (isCorrectAnswer) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};
