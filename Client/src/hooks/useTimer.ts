import { useEffect, useState } from 'react'

import connection from '../utils/api/signalr/Socket'

enum Events {
    StartTimer = 'StartTimer',
    StopTimer = 'StopTimer',
    ResetTimer = 'ResetTimer',
}
// TODO: No timer implemented in backend, so ignore for now!
export function UseTimer(duration: number) {
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        connection.on(Events.StartTimer, (timer: boolean) => {
            setIsRunning(true)
        })

        connection.on(Events.StopTimer, (timer: boolean) => {
            setIsRunning(false)
        })

        connection.on(Events.ResetTimer, (timer: boolean) => {
            setIsRunning(true)
        })
    }, [isRunning])
}
