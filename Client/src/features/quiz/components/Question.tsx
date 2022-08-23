import { Box, Flex,Heading, Progress, Spacer, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react';

type Props = {
  question: string
}

export const Question = ({ question }: Props) => {
  const text = useColorModeValue('black', 'white');
  return (
    <Box borderRadius='md' bgColor='#4C566A' w='full' mx='auto' my='auto' p={6}>
      <Box>
        <Text fontSize={['xl', '2xl', '4xl']} color="white" h='60%'>
          {question}?
        </Text>
      </Box>

      <Box pt={20} mx='auto' my='auto'>
        <Progress borderRadius='md' value={20} />
      </Box>
    </Box>
  );
};