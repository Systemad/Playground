import { Box, Button } from '@chakra-ui/react';

type Props = {
    canStart: boolean;
    onClick: () => void;
};

export const ReadyButton = ({ canStart, onClick }: Props) => {
    if (!canStart) {
        return (
            <Box
                borderRadius="md"
                bgColor="#4C566A"
                w="full"
                mx="auto"
                my="auto"
                p={6}
            >
                Wait for owner to start
            </Box>
        );
    }
    return (
        <Button
            isDisabled={canStart}
            borderRadius="md"
            bgColor="#4C566A"
            w="full"
            mx="auto"
            my="auto"
            p={6}
            onClick={() => onClick}
        >
            Start
        </Button>
    );
};
