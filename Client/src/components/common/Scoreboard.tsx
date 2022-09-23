import {
    Avatar,
    Badge,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Input,
    Link,
    Spacer,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import {
    PlayerRuntime,
    Scoreboard,
    useQuizGetGameScoreboardQuery,
} from '../../features/quiz/api/quizAPI';
import { UseQuizScoreboard } from '../../features/quiz/hooks/useQuizScoreboard';
import connection from '../../utils/api/signalr/Socket';

type Props = {
    scoreboard?: Scoreboard;
};

interface Message {
    id: string;
    name: string;
    content: string;
}

export const GameScoreboard = ({ scoreboard }: Props) => {
    return (
        <Flex
            overflow="hidden"
            borderRadius="md"
            h="20vh"
            w="full"
            bg="blue.800"
        >
            <HStack
                borderRadius="md"
                p={1}
                w="full"
                align="center"
                justify="space-evenly"
            >
                {scoreboard?.players?.map((item) => (
                    <PlayerCard key={item.id} player={item} />
                ))}
            </HStack>
            <Chatbox />
        </Flex>
    );
};

type PlayerCardProps = {
    player?: PlayerRuntime;
};

const PlayerCard = ({ player }: PlayerCardProps) => {
    return (
        <Center w="full" h="full">
            <Box
                h="full"
                w={'full'}
                bg={player?.answeredCorrectly ? 'green.600' : 'blue.600'}
                rounded={'md'}
                px={4}
                textAlign={'center'}
            >
                <Stack my={5} direction={'row'} align={'center'}>
                    {/*
                                            <Avatar
                        size={'md'}
                        src={
                            'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                        }
                        pos={'relative'}
                    />
                        */}
                    <Heading fontSize={'md'} fontFamily={'body'}>
                        {player?.name}
                    </Heading>
                </Stack>
                <Box
                    w="full"
                    bg="green.700"
                    mt={6}
                    flex={1}
                    fontSize={'sm'}
                    rounded={'md'}
                >
                    {player?.score}
                </Box>
            </Box>
        </Center>
    );
};

export const Chatbox = () => {
    const [messages, setMessages] = useState<Message[]>([]);

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
            connection.invoke('SendMessage', value);
            setValue('');
        } else {
            setValue(event.target.value);
        }
    };

    useEffect(() => {
        connection.on('ReceiveMessage', (message: Message) => {
            setMessages((_messages) => [..._messages, message]);
        });
    });

    return (
        <>
            <Box
                h="100%"
                w="40%"
                bg="gray.500"
                overflowY="scroll"
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '10px',
                        borderRadius: 'md',
                        backgroundColor: '#4C566A',
                    },
                }}
            >
                <Flex
                    flexDir="column"
                    key="1"
                    w="100%"
                    h="75%"
                    justify="flex-start"
                >
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
                <Input
                    variant="filled"
                    value={value}
                    onChange={handleChange}
                    placeholder="Enter your message"
                    size="sm"
                />
                <AlwaysScrollToBottom />
            </Box>
        </>
    );
};