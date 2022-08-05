import { Flex, Heading, Spacer, Stack, Text, useToast } from '@chakra-ui/react';

type Props = {
  question: string
}

export const Question = ({ question }: Props) => {
  return (
    <Text fontSize={['xl', '2xl', '4xl']} color="gray.50" h="60%">
      {question}
    </Text>
  );
};