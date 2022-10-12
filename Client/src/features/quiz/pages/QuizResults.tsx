import { CheckCircleIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Center,
    Heading,
    SimpleGrid,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';

export const QuizResults = () => {
    //const gameresults = usegetresults
    //const { data: results } = useQuiz;

    return (
        <Box textAlign="center" py={10} px={6}>
            <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
                LOSS
            </Heading>
            <SimpleGrid
                borderRadius="md"
                h="full"
                columns={2}
                spacingX="40px"
                spacingY="20px"
            >
                <PlayerCard />
                <PlayerCard />
                <PlayerCard />
                <PlayerCard />
            </SimpleGrid>
        </Box>
    );
};

const PlayerCard = () => {
    return (
        <Center py={6}>
            <Box
                maxW={'320px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                rounded={'lg'}
                p={4}
                textAlign={'center'}
            >
                <Avatar
                    size={'lg'}
                    name={'My Name'}
                    src={
                        'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                    }
                    mb={2}
                    pos={'relative'}
                />
                <Heading fontSize={'xl'} fontFamily={'body'}>
                    Lindsey James
                </Heading>

                <Stack mt={6} direction={'row'} spacing={2}>
                    <Box
                        flex={1}
                        fontSize={'lg'}
                        rounded={'full'}
                        _focus={{
                            bg: 'gray.200',
                        }}
                    >
                        Score: 1
                    </Box>
                </Stack>
            </Box>
        </Center>
    );
};
