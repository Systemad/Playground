import { Button, useStyleConfig } from '@chakra-ui/react';
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
    //const styles = useStyleConfig('Button', { TextAnswerButton });
    return (
        <Button
            variant="textAnswerButton"
            whiteSpace="break-spaces"
            name={choice}
            backgroundColor={colorStatus}
            isDisabled={isDisabled}
            onClick={() => onClick(choice)}
        >
            {choice}
        </Button>
    );
};

/*
        <Button
            variant="textAnswerButton"
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
            borderRadius="md"
            h="100px"
            w="100%"
            transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
            isDisabled={isDisabled}
            onClick={() => onClick(choice)}
        >
            {choice}
        </Button>
*/
