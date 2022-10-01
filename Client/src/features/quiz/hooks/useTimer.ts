import { useEffect, useState } from 'react';

import { useAppDispatch } from '../../../providers/store';
import { quizSplitApi } from '../api/quizAPI';
import { WebsocketEvents } from '../Events';

export function useTimer(gameId: string): void {
    const [timer, setTimer] = useState<number | undefined>();
    useEffect(() => {
        //connection.on();
    });
}
