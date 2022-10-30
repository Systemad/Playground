import {
    Box,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    SimpleGrid,
    StackDivider,
    Text,
    VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';

import { Answer } from '../components/common/AnswerButton';
import { Header } from '../features/quiz/components/Header';
import { buttonStatus, isButtonDisabled } from '../features/quiz/utils/Helper';
import { PlayerStateDto } from '../redux/quizSlice';
import { socketctx } from '../utils/api/signalr/ContextV2';

/*
 */
// ADD ANIMATION??
// TODO: Fixup MAIN PAGE!!!!
// TODO: Add category to Header
// Add progress color scheme and timer from backend!

// Cleanup project and comments backend and frontend
// Potentially fix websocket multiple calls??
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
    question:
        "In the game Dark Souls, what is the name of the region you're in for the majority of the game?",
    number: 1,
    answers: ['Drangleic', 'Oolacile', 'Catarina', 'Lordran'],
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
                            p="0.35rem"
                            rounded={'md'}
                            area={'main'}
                            bg="cupcake.base200"
                        >
                            <Header
                                currentQuestion={question1.question}
                                step={question1.number}
                                total={10}
                                category={'Games and'}
                                difficulty={'Hard'}
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

const msg1: Message = {
    id: '1',
    name: 'Adam',
    content: 'My first game ever here!',
};
const msg2: Message = {
    id: '2',
    name: 'Jones',
    content: 'Mine too, excited to play!',
};
const msg3: Message = {
    id: '3',
    name: 'Chief',
    content: 'Hello, I am just writing random stuff',
};

const msg4: Message = {
    id: '4',
    name: 'Boe',
    content: 'I am best guesser ever',
};

const messageList = [msg1, msg2, msg3, msg4];
/*
   id: string;
    name: string;
    score: number;
    answered?: boolean;
    answeredCorrectly?: boolean | undefined;
*/

const player1: PlayerStateDto = {
    id: '1',
    name: 'Adam',
    score: 1,
    answered: true,
    answeredCorrectly: true,
};

const player2: PlayerStateDto = {
    id: '2',
    name: 'Boe',
    score: 4,
    answered: true,
    answeredCorrectly: false,
};

const player3: PlayerStateDto = {
    id: '3',
    name: 'Jones',
    score: 10,
    answered: false,
    answeredCorrectly: undefined,
};

const player4: PlayerStateDto = {
    id: '4',
    name: 'Chief',
    score: 5,
    answered: true,
    answeredCorrectly: undefined,
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
    answeredCorrectly?: boolean
): string => {
    if (answered && answeredCorrectly === true) {
        // Answered and correct
        return 'cupcake.success';
    } else if (answered && answeredCorrectly === false) {
        // Answered and not correct
        return 'cupcake.error';
    } else if (answered && answeredCorrectly === undefined) {
        // Answered but waiting for round result
        return 'cupcake.info';
    } else {
        // Not answered
        return 'cupcake.base200';
    }
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
                overflow="hidden"
            >
                <Box position="absolute" bottom="2px">
                    <Box
                        overflowY="scroll"
                        sx={{
                            '&::-webkit-scrollbar': {
                                width: '5px',
                                borderRadius: 'md',
                                backgroundColor: '#dbd4d4',
                            },
                            '&::-webkit-scrollbar-track': {
                                height: '10px',
                                width: '5px',
                                borderRadius: 'md',
                                backgroundColor: '#dbd4d4',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                height: '10px',
                                width: '5px',
                                borderRadius: 'md',
                                backgroundColor: '#dbd4d4',
                            },
                        }}
                        flexDir="column"
                        wordBreak={'break-word'}
                    >
                        {messageList.map((item, index) => (
                            <Flex
                                borderRadius={'md'}
                                key={index}
                                bg="#dbd4d4" // TODO: remove this
                                w="100%"
                                my="0.5"
                                p="0.5"
                                textColor="black"
                            >
                                {item.name}: {item.content}
                            </Flex>
                        ))}
                    </Box>

                    <VStack>
                        <Divider borderColor="#dbd4d4" />
                        <InputGroup p="2px">
                            <Input
                                textColor="cupcake.primarycontent"
                                variant="filled"
                                value={value}
                                onChange={handleChange}
                                placeholder="Enter your message"
                                size="md"
                                _placeholder={{ opacity: 1, color: 'inherit' }}
                            />
                            <InputRightElement
                                // eslint-disable-next-line react/no-children-prop
                                children={<MdSend color="black" />}
                            />
                        </InputGroup>
                    </VStack>

                    <AlwaysScrollToBottom />
                </Box>
            </Box>
        </>
    );
};
