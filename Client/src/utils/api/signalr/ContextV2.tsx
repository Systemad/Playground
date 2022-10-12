import {
    HubConnection,
    HubConnectionState,
    IStreamResult,
} from '@microsoft/signalr';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

export enum StreamState {
    Connecting,
    Error,
    Completed,
    Awaiting,
    Active,
}

export const socketctx = createContext<HubConnection | void>(undefined);

export const ConnectionProvider = (props: {
    connection: HubConnection;
    children: ReactNode;
}) => {
    const { connection, children } = props;
    const [active, setActive] = useState(() =>
        connection.state === HubConnectionState.Connected
            ? connection
            : undefined
    );

    useEffect(() => {
        async function start() {
            if (connection.state === HubConnectionState.Disconnected) {
                await connection.start().then(() => setActive(connection));

                //return async () => {
                //    await connection.stop();
                //};
            }
        }
        start();

        async function stop() {
            if (connection.state === HubConnectionState.Connected) {
                await connection.stop().then(() => setActive(undefined));
            }
        }
        return () => {
            stop();
            //connection.stop();
            //() => connection.onclose(() => setActive(undefined));
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        //return () => {};
    }, [connection]);

    return <socketctx.Provider value={active}>{children}</socketctx.Provider>;
};
