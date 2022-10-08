import { useEffect, useState } from 'react';

export function useTimer(gameId: string): void {
    const [timer, setTimer] = useState<number | undefined>();
    useEffect(() => {
        //connection.on();
    }, []);
}
