import { SimpleGrid } from '@chakra-ui/react';

import { AnswerButton } from './AnswerButton';

export type Props = {
  disabled: boolean,
  choices: string[] | undefined,
  onClick: (e: string) => void,
}

export const Answers = ({ choices, onClick, disabled } : Props) => (
  <SimpleGrid columns={[1, 2]} spacing={[4, 8]}>
    {choices?.map((answer, index) => {
      return (
        <AnswerButton
          name={answer}
          choice={answer}
          key={index + answer}
          fontSize="sm"
          w={['100%']}
          onClick={() => onClick(answer)}
          isDisabled={disabled}
        >
          {answer}
        </AnswerButton>
      );
    })}
  </SimpleGrid>
);