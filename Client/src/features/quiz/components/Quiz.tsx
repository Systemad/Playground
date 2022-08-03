import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer, DrawerBody, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerHeader,
  Flex,
  FlexProps, FormLabel, GridItem,
  Icon,
  IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon,
  Link, Select,   Spacer,
Stack,
  Text, Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

import { LobbyCard } from '../../lobby';
import { useLobbyGetGamesQuery } from '../../lobby/lobbyAPI';

// <LobbyCard title="Game1" gameMode="quiz" gameStatus="inprogress" players="1/4" />

export const QuizLayout = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {data: lobbies} = useLobbyGetGamesQuery();
  UseLobbySocket();

  return (
    <>
      <GridItem bg='papayawhip' area={'main'}>
        <Flex h="10vh">
          <Text color="gray.50" size="lg">
            Question {questionIndex + 1}/{questions?.length}
          </Text>
          <Spacer />
          <Text color="gray.50">Score: {score}</Text>
        </Flex>
        <Stack textAlign="center" h="60vh">
          <Question
            key={questions?.[questionIndex].id}
            question={questions?.[questionIndex].question}
          />
          <Answers
            correctAnswer={questions?.[questionIndex].answer}
            answerChoices={questions?.[questionIndex].answerChoices}
            onClick={handleAnswer}
            disabled={disabled}
          />
        </Stack>
      </GridItem>
    </>
  )
}