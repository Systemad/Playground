import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';

import { AnswerButton } from './AnswerButton';

export type Props = {
  disabled: boolean,
  choices: string[] | undefined,
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Answers = ({ choices, onClick, disabled } : Props) => (
  <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
    {choices?.map((answer, index) => {
      return (
        <AnswerButton
          choice={answer}
          key={index + answer}
          onClick={onClick(answer)}
          isDisabled={disabled}
        >
          {answer}
        </AnswerButton>
      );
    })}
  </SimpleGrid>
);