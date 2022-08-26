import { Box, Button, chakra, Flex } from '@chakra-ui/react'

import { GameMode, GameState } from '../../enums'
import { GameStatusButton } from './GameStatusButton'

type Props = {
    title?: string
    gameMode?: GameMode
    players?: number
    gameStatus?: GameState
    difficulty?: string
    onClick: () => void
}
export const LobbyCard = ({
    title,
    gameMode,
    players,
    gameStatus,
    difficulty,
    onClick,
}: Props) => {
    let diff

    if (difficulty) {
        diff = (
            <Box
                px={3}
                py={1}
                bg="gray.600"
                color="gray.100"
                fontSize="sm"
                fontWeight="700"
                rounded="md"
            >
                {difficulty}
            </Box>
        )
    }

    return (
        <>
            <Box
                position="relative"
                mx="auto"
                px={8}
                py={4}
                rounded="lg"
                shadow="lg"
                bg="white"
                _dark={{
                    bg: 'gray.800',
                }}
                w="300px"
            >
                <Flex justifyContent="space-between" alignItems="center">
                    <chakra.span
                        fontWeight="700"
                        fontSize="xl"
                        color="gray.600"
                        _dark={{
                            color: 'gray.400',
                        }}
                    >
                        {title}
                    </chakra.span>
                    <Flex>
                        {diff}
                        {gameMode && (
                            <Box
                                px={3}
                                py={1}
                                bg="gray.600"
                                color="gray.100"
                                fontSize="sm"
                                fontWeight="700"
                                rounded="md"
                            >
                                {GameMode[gameMode]}
                            </Box>
                        )}
                    </Flex>
                </Flex>

                <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <GameStatusButton
                        gameStatus={gameStatus}
                        players={players}
                    />
                    <Button
                        textTransform="uppercase"
                        colorScheme="teal"
                        size="md"
                        onClick={() => onClick()}
                    >
                        Join
                    </Button>
                </Flex>
            </Box>
        </>
    )
}
