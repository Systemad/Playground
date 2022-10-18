import { useContext, useEffect, useState } from 'react';

import { socketctx } from '../../../utils/api/signalr/ContextV2';

export type LobbyPlayer = {
    id: string;
    name: string;
    ready: boolean;
};
export const useLobbyPlayers = () => {
    const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>();
    const connection = useContext(socketctx);
    useEffect(() => {
        const usersReadyListener = (players: LobbyPlayer[]) => {
            console.log('lobby-players');
            setLobbyPlayers(players);
        };
        connection?.on('lobby-players', usersReadyListener);

        return () => {
            connection?.off('lobby-players', usersReadyListener);
        };
    }, [connection]);

    return lobbyPlayers;
};
