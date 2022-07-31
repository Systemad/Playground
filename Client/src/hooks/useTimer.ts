import { useEffect, useState } from 'react';

import connection from '../utils/api/signalr/Socket';


enum TimerActions
{
  StartTimer = "StartTimer",
  StopTimer = "StopTimer",
  ResetTimer = "ResetTimer"
}
// TODO: Implement timer hook or extract and make timer in own component!!
export function UseTimer(duration: number) {

  const [isRunning, setIsRunning] = useState(false);

  useEffect((): any => {
    connection.on(TimerActions.StartTimer, (timer: boolean) => {
        setIsRunning(true);
    })

    connection.on(TimerActions.StopTimer, (timer: boolean) => {
      setIsRunning(false);
    })

    connection.on(TimerActions.ResetTimer, (timer: boolean) => {
      setIsRunning(true);
    });
  }, [isRunning])
}