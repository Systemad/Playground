import { Avatar, Box, Center, Heading, HStack, VStack } from '@chakra-ui/react';

import { useQuizGetGameResultsQuery } from '../features/quiz/api/quizAPI';
import { useAppSelector } from '../providers/store';
import { selectGame } from '../redux/quizSlice';

export const ResultTest = () => {
    //const gameresults = usegetresults
    const game = useAppSelector(selectGame);
    const gameId = game && game.runtime?.gameId;

    const { data: results } = useQuizGetGameResultsQuery({ gameId: gameId });

    return (
        <VStack>
            <Heading
                as="h1"
                size="3xl"
                borderRadius={'md'}
                p="0.35rem"
                shadow={'md'}
                bgColor="cupcake.base200"
                textColor="cupcake.primarycontent"
            >
                WINNER: {(results && results?.winner) ?? 'unkown'}
            </Heading>
            <Center
                height={'90vh'}
                justifyContent={'center'}
                alignContent="center"
            >
                <HStack>
                    {results &&
                        results.scoreboard?.map((player, index) => (
                            <>
                                <PlayerCard
                                    key={player.id}
                                    id={player.id}
                                    name={player.name}
                                    score={player.score}
                                />
                                ;
                            </>
                        ))}
                </HStack>
            </Center>
        </VStack>
    );
};

type PlayerCardProps = { id: string; name: string; score: number };

const PlayerCard = ({ id, name, score }: PlayerCardProps) => {
    return (
        <Center py={6}>
            <Box
                w={'15rem'}
                bgColor="cupcake.base200"
                boxShadow={'md'}
                rounded={'md'}
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
                <Heading
                    textColor="cupcake.primarycontent"
                    fontSize={'xl'}
                    fontFamily={'body'}
                >
                    Lindsey James
                </Heading>

                <Box
                    textColor="cupcake.primarycontent"
                    flex={1}
                    fontSize={'lg'}
                    rounded={'full'}
                >
                    Score: 1
                </Box>
            </Box>
        </Center>
    );
};
