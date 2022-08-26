import { Button } from '@chakra-ui/react'
import React, { useState } from 'react'

import connection from '../../utils/api/signalr/Socket'
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
export type Props = {
    children: React.ReactNode
    choice: string
    isDisabled: boolean
    onClick: () => void
}

export const AnswerButton = ({
    children,
    choice,
    isDisabled,
    onClick,
}: Props) => {
    const [color, setColor] = useState('#5E81AC')

    connection.on('RoundResults', (correct: string) => {
        if (choice == correct) {
            setColor('#8FBCBB')
        } else {
            setColor('#BF616A')
        }
    })

    connection.on('NextRound', () => {
        setColor('#5E81AC')
    })

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore no problem in operation, although type error appears.
        <Button
            fontSize="sm"
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
            h="24px"
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
    )
}
