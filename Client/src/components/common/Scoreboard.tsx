import {
    Box,
    Center,
    Divider,
    Flex,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    StackDivider,
    Text,
    VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';

import { useAppSelector } from '../../providers/store';
import { PlayerStateDto, selectGame } from '../../redux/quizSlice';
import { socketctx } from '../../utils/api/signalr/ContextV2';

interface Message {
    id: string;
    name: string;
    content: string;
}

export const GameScoreboard = () => {
    const scoreboard = useAppSelector(selectGame).runtime?.scoreboard;
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

export const Chatbox = () => {
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
                        {messages.map((item, index) => (
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
