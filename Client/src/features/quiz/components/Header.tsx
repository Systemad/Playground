import { Box, Flex, Progress, Text } from '@chakra-ui/react';

type Props = {
    currentQuestion?: string;
    step: number;
    total?: number;
    category: string;
    difficulty: string;
};

export const Header = ({
    currentQuestion,
    step,
    total,
    category,
    difficulty,
}: Props) => {
    return (
        <Box
            borderRadius="md"
            bgColor="cupcake.altbase200"
            mx="auto"
            my="auto"
            p={6}
        >
            <Flex h="10vh" justifyContent={'space-between'}>
                <Text color="cupcake.primarycontent" size="lg">
                    Question {step + 1}/{total}
                </Text>
                <Text color="cupcake.primarycontent" size="lg">
                    {category}
                </Text>
                <Text color="cupcake.primarycontent" size="lg">
                    {difficulty}
                </Text>
            </Flex>
            <Box>
                <Text fontSize={['2xl']} color="cupcake.primarycontent" h="60%">
                    {currentQuestion}
                </Text>
            </Box>

            <Box pt={20} mx="auto" my="auto">
                <Progress colorScheme={'red'} borderRadius="md" value={20} />
            </Box>
        </Box>
    );
};
