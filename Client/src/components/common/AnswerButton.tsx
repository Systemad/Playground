import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';

import connection from '../../utils/api/signalr/Socket';
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
export type Props = {
    children: React.ReactNode;
    choice: string;
    isDisabled: boolean;
    onClick: () => void;
};

export const Answer = ({ children, choice, isDisabled, onClick }: Props) => {
    const [color, setColor] = useState('#5E81AC');

    // TODO: Fix! Server sends correct answer to client, client then checks. Use Redux or useContext!
    connection.on('RoundResults', (correct: string) => {
        if (choice === correct) {
            setColor('#8FBCBB');
        } else {
            setColor('#BF616A');
        }
    });

    connection.on('NextRound', () => {
        setColor('#5E81AC');
    });

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
            backgroundColor={color}
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
            onClick={() => onClick()}
        >
            {children}
        </Button>
    );
};
