import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

interface Message {
    user: string
    message: string
}

const msg1: Message = {
    user: 'user1',
    message: 'hello',
}
const msg2: Message = {
    user: 'user1',
    message: 'hello',
}
const msg3: Message = {
    user: 'user1',
    message: 'hello',
}

const messagesarray: Message[] = [msg1, msg2, msg3]

type Props = {
    messages: Message[]
}

export const Chatbox = () => {
    return (
        <>
            <Box w="40%" bg="#edf3f8" overflowY="scroll">
                <Flex flexDir="column" key="1" w="100%" justify="flex-start">
                    {messagesarray.map((item, index) => (
                        <Flex
                            key={index}
                            bg="black"
                            color="white"
                            minW="100px"
                            maxW="350px"
                            my="1"
                            p="1"
                        >
                            <Text>
                                {item.user}: {item.message}
                            </Text>
                        </Flex>
                    ))}
                </Flex>
            </Box>
        </>
    )
}
