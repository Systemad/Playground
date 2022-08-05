import { SimpleGrid } from '@chakra-ui/react';

import { AnswerButton } from './AnswerButton';

export type Props = {
  onClick: () => void,
}

export const Answers = ({ correctAnswer, answerChoices, onClick, disabled } : Props) => (
  <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
    {answerChoices?.map((answer, index) => {
      return (
        <AnswerButton
          name={answer}
          key={index + answer}
          fontSize="sm"
          w={['100%']}
          onClick={() => onClick(correctAnswer)}
          isDisabled={disabled}
        >
          {decoder(answer)}
        </AnswerButton>
      );
    })}
  </SimpleGrid>
);