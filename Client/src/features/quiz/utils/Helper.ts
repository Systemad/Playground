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
        return 'cupcake.success';
    } else if (isSelectedAnswer && answerIsIncorrect) {
        return 'cupcake.error';
    } else if (isSelectedAnswer) {
        return 'blue.700';
    } else {
        return 'blue.200';
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
