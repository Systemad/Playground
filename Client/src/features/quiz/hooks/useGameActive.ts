import { useContext, useEffect, useState } from 'react';

import { useAppDispatch } from '../../../providers/store';
import { SocketContext } from '../../../utils/contexts/SignalrContext';
import { quizSplitApi } from '../api/quizAPI';
import { WebsocketEvents } from '../Events';

export const useGameActive = () => {
    const [active, setActive] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    useEffect(() => {
        socket.on('game-active', (status: boolean) => {
            setActive(status);
        });
    });

    return active;
};
