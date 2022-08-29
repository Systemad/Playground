import {
    Avatar,
    Badge,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Link,
    Spacer,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'

import { PlayerRuntime } from '../../features/quiz/api/quizAPI'

interface Message {
    user: string
    message: string
}

const msg1: Message = {
    user: 'user1',
    message: 'hello',
}
const msg2: Message = {
    user: 'user2',
    message: 'hello',
}
const msg3: Message = {
    user: 'user3',
    message: 'hello',
}
const msg4: Message = {
    user: 'user4',
    message: 'hello',
}
const msg5: Message = {
    user: 'user5',
    message: 'hello',
}

const messagesarray: Message[] = [msg1, msg2, msg3, msg4, msg5]

type Props = {
    gameId: string
}

export const PlayerInfo = ({ gameId }: Props) => {
    const AlwaysScrollToBottom = () => {
        const elementRef = useRef<HTMLDivElement>(null)
        useEffect(() => {
            if (elementRef != null) {
                elementRef?.current?.scrollIntoView()
            }
        })
        return <div ref={elementRef} />
    }
    useEffect(() => {
        console.log('hey')
    })

    const Chatbox = () => {
        return (
            <>
                <Box
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
                        justify="flex-start"
                    >
                        {messagesarray.map((item, index) => (
                            <Flex
                                key={index}
                                bg="gray.600" // TODO: remove this
                                w="100%"
                                my="0.5"
                                p="0.5"
                            >
                                <Text color="white">
                                    {item.user}: {item.message}
                                </Text>
                            </Flex>
                        ))}
                    </Flex>
                    <AlwaysScrollToBottom />
                </Box>
            </>
        )
    }

    return (
        <Flex
            overflow="hidden"
            borderRadius="md"
            h="20vh"
            w="full"
            bg="blue.200"
        >
            <HStack
                borderRadius="md"
                p={1}
                w="full"
                align="center"
                justify="space-evenly"
            >
                <SocialProfileSimple />
                <SocialProfileSimple />
                <SocialProfileSimple />
                <SocialProfileSimple />
            </HStack>
            <Chatbox />
        </Flex>
    )
}

type PlayerCardProps = {
    player?: PlayerRuntime
}

const SocialProfileSimple = ({ player }: PlayerCardProps) => {
    return (
        <Center w="full" h="full">
            <Box
                h="full"
                w={'full'}
                bg={player?.answered ? 'green.600' : 'blue.600'} // Change this based on if player answered yes or not,
                // maybe in future change after round if answe is correct
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
    )
}
