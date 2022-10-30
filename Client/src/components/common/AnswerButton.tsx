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
