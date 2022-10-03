import { useContext, useEffect, useState } from 'react';

import { SocketContext } from '../../../utils/contexts/SignalrContext';

export const useGameActive = () => {
    const [active, setActive] = useState<boolean>(false);
    const socket = useContext(SocketContext);
    useEffect(() => {
        socket.on('start-game', () => {
            setActive(true);
        });
    });

    useEffect(() => {
        socket.on('stop-game', () => {
            setActive(false);
        });
    });

    return active;
};
