import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Image,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

export const ProfilePageCard = () => {
    let hey;

    return (
        <Box
            maxW={'350px'}
            w={'full'}
            h={'60vh'}
            maxH={'70vh'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}
        >
            <Image
                h={'120px'}
                w={'full'}
                src={
                    'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
                }
                objectFit={'cover'}
            />
            <Flex justify={'center'} mt={-12}>
                <Avatar
                    size={'xl'}
                    name={'John Doe'}
                    src={
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                    }
                    css={{
                        border: '2px solid white',
                    }}
                />
            </Flex>

            <Box p={6}>
                <Stack spacing={0} align={'center'} mb={7}>
                    <Heading
                        fontSize={'2xl'}
                        fontWeight={500}
                        fontFamily={'body'}
                    >
                        John Doe
                    </Heading>
                    <Text color={'gray.500'}>Frontend Developer</Text>
                </Stack>

                <Stack direction={'row'} justify={'center'} spacing={6}>
                    <Stack spacing={0} align={'center'}>
                        <Text fontSize={'xl'} fontWeight={600}>
                            1
                        </Text>
                        <Text fontSize={'2xl'} color={'gray.500'}>
                            Wins
                        </Text>
                    </Stack>
                    <Stack spacing={0} align={'center'}>
                        <Text fontSize={'xl'} fontWeight={600}>
                            2
                        </Text>
                        <Text fontSize={'2xl'} color={'gray.500'}>
                            Losses
                        </Text>
                    </Stack>
                </Stack>

                <HStack mt={10} w={'full'}>
                    <Button
                        w={'full'}
                        bg={useColorModeValue('#151f21', 'gray.900')}
                        color={'white'}
                        rounded={'md'}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}
                    >
                        Friend
                    </Button>
                    <Button
                        w={'full'}
                        bg={useColorModeValue('#151f21', 'gray.900')}
                        color={'white'}
                        rounded={'md'}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}
                    >
                        Message
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
};
