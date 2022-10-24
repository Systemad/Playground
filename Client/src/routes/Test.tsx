import { CheckIcon } from '@chakra-ui/icons';
import {
    Box,
    Center,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    SimpleGrid,
    Stack,
    StackDivider,
    Text,
    VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';

import { Answer } from '../components/common/AnswerButton';
import { PlayerState } from '../features/quiz/api/quizAPI';
import { Header } from '../features/quiz/components/Header';
import { buttonStatus, isButtonDisabled } from '../features/quiz/utils/Helper';
import { useAppSelector } from '../providers/store';
import { PlayerStateDto, selectGame } from '../redux/quizSlice';
import { socketctx } from '../utils/api/signalr/ContextV2';

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
                    <Grid
                        templateAreas={'"score main chat"'}
                        gridTemplateRows={'90vh'}
                        gridTemplateColumns={'1fr 3fr 1fr'}
                        gap="4"
                    >
                        <GridItem
                            rounded={'md'}
                            area={'score'}
                            bg="cupcake.base200"
                        >
                            <GameScoreboard />
                        </GridItem>

                        <GridItem
                            rounded={'md'}
                            area={'main'}
                            bg="cupcake.base200"
                        >
                            <Header
                                currentQuestion={question1.question}
                                step={question1.number}
                                total={10}
                            />

                            <SimpleGrid
                                columns={[1, 2]}
                                my="1rem"
                                spacing={[4, 8]}
                            >
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
                                            answer === selectedAnswer
                                                ? true
                                                : false
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
                        </GridItem>

                        <GridItem
                            rounded={'md'}
                            area={'chat'}
                            bg="cupcake.base200"
                        >
                            <Chatbox />
                        </GridItem>
                    </Grid>
                </>
            )}
        </>
    );
};

interface Message {
    id: string;
    name: string;
    content: string;
}

/*
   id: string;
    name: string;
    score: number;
    answered?: boolean;
    answeredCorrectly?: boolean | undefined;
*/

const player1: PlayerStateDto = {
    id: '1',
    name: 'player1',
    score: 1,
    answered: true,
    answeredCorrectly: true,
};

const player2: PlayerStateDto = {
    id: '2',
    name: 'player2',
    score: 4,
    answered: true,
    answeredCorrectly: false,
};

const player3: PlayerStateDto = {
    id: '3',
    name: 'player3',
    score: 10,
    answered: false,
    answeredCorrectly: undefined,
};

const player4: PlayerStateDto = {
    id: '4',
    name: 'player4',
    score: 5,
    answered: true,
    answeredCorrectly: false,
};

const scoreboard = [player1, player2, player3, player4];

const GameScoreboard = () => {
    return (
        <VStack
            divider={<StackDivider borderColor="cupcake.base100" />}
            h="full"
            w="full"
            align="center"
            justify="space-evenly"
        >
            {scoreboard?.map((item) => (
                <PlayerCard key={item.id} player={item} />
            ))}
        </VStack>
    );
};

type PlayerCardProps = {
    player?: PlayerStateDto;
};

const CardBackground = (
    answered?: boolean,
    answeredCorrectly?: boolean | null
): string => {
    if (answered && answeredCorrectly === null) return 'blue.700';
    if (answered && answeredCorrectly && answeredCorrectly !== null)
        return 'cupcake.success';
    if (answered && (!answeredCorrectly !== answeredCorrectly) !== null)
        return 'cupcake.error';

    return 'grey.700';
};

const PlayerCard = ({ player }: PlayerCardProps) => {
    return (
        <Box
            p="30px"
            h="full"
            w="full"
            bg={CardBackground(player?.answered, player?.answeredCorrectly)}
            rounded={'md'}
            justifyContent="center"
            textAlign={'center'}
        >
            <VStack>
                <Heading
                    color="cupcake.primarycontent"
                    fontSize={'xl'}
                    fontFamily={'body'}
                >
                    {player?.name}
                </Heading>
                <Text color="cupcake.primarycontent" fontSize={'md'}>
                    Score: {player?.score}
                </Text>

                <Text color="cupcake.primarycontent" fontSize={'md'}>
                    {player?.answered ? 'Answered' : 'Not Answered'}
                </Text>
            </VStack>
        </Box>
    );
};

const Chatbox = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const connection = useContext(socketctx);

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
            if (elementRef != null) {
                elementRef?.current?.scrollIntoView();
            }
        });
        return <div ref={elementRef} />;
    };

    const [value, setValue] = useState('');
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target.value === '13') {
            connection?.invoke('SendMessage', value);
            setValue('');
        } else {
            setValue(event.target.value);
        }
    };

    useEffect(() => {
        connection?.on('ReceiveMessage', (message: Message) => {
            setMessages((_messages) => [..._messages, message]);
        });
    }, [connection]);

    return (
        <>
            <Box
                position="relative"
                rounded={'md'}
                h="full"
                bg="cupcake.base200"
                overflowY="scroll"
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '10px',
                        borderRadius: 'md',
                        backgroundColor: '#4C566A',
                    },
                }}
            >
                <Flex flexDir="column" key="1" justify="flex-end">
                    {messages.map((item, index) => (
                        <Flex
                            key={index}
                            bg="gray.600" // TODO: remove this
                            w="100%"
                            my="0.5"
                            p="0.5"
                        >
                            {item.name}: {item.content}
                        </Flex>
                    ))}
                </Flex>

                <VStack position="absolute" bottom="2px">
                    <Divider borderColor="cupcake.primarycontent" />
                    <InputGroup p="2px">
                        <Input
                            textColor="cupcake.primarycontent"
                            variant="filled"
                            value={value}
                            onChange={handleChange}
                            placeholder="Enter your message"
                            size="lg"
                            _placeholder={{ opacity: 1, color: 'inherit' }}
                        />
                        <InputRightElement
                            // eslint-disable-next-line react/no-children-prop
                            children={<CheckIcon color="green.500" />}
                        />
                    </InputGroup>
                </VStack>

                <AlwaysScrollToBottom />
            </Box>
        </>
    );
};
