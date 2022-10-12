import { Button, ButtonProps, Flex, useColorModeValue } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { GameContext } from '../../../contexts/GameContext';
import { socketctx } from '../../../utils/api/signalr/ContextV2';
import { Game } from '../components/Game';
import { PreGame } from '../components/PreGame';
import { useQuizRuntime } from '../hooks/useQuizSettings';
import { useScoreboard } from '../hooks/useScoreboard';
// TODO: When game ends, navigate to gameid/results
export const Quiz = () => {
    const runtime = useQuizRuntime();
    const scoreboard = useScoreboard();
    const connection = useContext(socketctx);
    const gameId = useContext(GameContext);

    const LeaveButton = (props: ButtonProps) => {
        const [colorCode, setColorCode] = useState(colorList[randomColor()]);

        const Leave = async () =>
            await connection?.invoke('leave-game', gameId);

        return (
            <Button
                {...props}
                px={8}
                bg={useColorModeValue('#151f21', 'gray.900')}
                color={'white'}
                rounded={'md'}
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                }}
                onClick={() => Leave()}
            >
                Click Me
            </Button>
        );
    };
    return (
        <>
            {gameId && runtime && (
                <>
                    {runtime.status === 'InProgress' && (
                        <>
                            InProgress
                            <Game runtime={runtime} scoreboard={scoreboard} />
                        </>
                    )}
                    {runtime.status === 'Finished' && <>results page here</>}
                </>
            )}
            {!gameId && (
                <>You are not in a game, back out to home and join one</>
            )}
        </>
    );
};

function randomColor() {
    return Math.floor(Math.random() * 5);
}

const colorList: string[] = [
    '#E53E3E',
    '#38A169',
    '#00B5D8',
    '#44337A',
    '#ED64A6',
];
