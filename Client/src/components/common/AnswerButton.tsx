import { Button } from '@chakra-ui/react';
export type Props = {
    choice: string;
    isDisabled: boolean;
    colorStatus: string;
    selected: boolean;
    onClick: (answer: string) => void;
};

export const Answer = ({
    choice,
    isDisabled,
    colorStatus,
    selected,
    onClick,
}: Props) => {
    return (
        <Button
            fontSize="md"
            name={choice}
            as="button"
            style={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
            }}
            color="white"
            backgroundColor={colorStatus}
            _hover={{
                transform: 'scale(1.03)',
                background: '#81A1C1',
            }}
            p="28px"
            lineHeight="1.2"
            borderRadius="md"
            h="70px"
            w={['100%']}
            display="inline-flex"
            outline="none"
            position="relative"
            verticalAlign="middle"
            justifyContent="center"
            alignItems="center"
            transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
            isDisabled={isDisabled}
            onClick={() => onClick(choice)}
        >
            {choice}
        </Button>
    );
};
