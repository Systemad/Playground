import { Flex, Spacer, Text } from '@chakra-ui/react';

type Props = {
  step: number,
  total: number,
}
export const Scoreboard = ({step, total} : Props) => {

  //useQuizScoreboard();

  return(
    <Flex h="10vh">
      <Text color="gray.50" size="lg">
        Question {(step) + 1}/{total}
      </Text>
      <Spacer />

    </Flex>

  )
}

/*
      // TODO: Loop player, with use of dictioranry
      // use hook to listen for even, and just update whole class
      <Text color="gray.50">Score: {score}</Text>
 */