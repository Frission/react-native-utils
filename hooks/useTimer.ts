import { isNumber } from "lodash"
import React from "react"

/** 
 * Starts a timer which counts in seconds, stopping the timer will not reset the time, starting the timer will reset the time
 * You can also use startTimer to restart it
 * @param timerInterval optional interval for the timer, every time the interval passes, timer will increment by 1, default is 1000
 */
export default (timerInterval: number = 1000): [
    time: number,
    startTimer: () => void,
    stopTimer: (resetTime?: boolean) => void,
    isActive: () => boolean,
    resetTime: (to?: number) => void,
] => {

    const [time, setTime] = React.useState(0)
    const [timer, setTimer] = React.useState<NodeJS.Timeout | undefined>(undefined)

    const startTimer = React.useCallback(() => {
        if (timer)
            clearInterval(timer)

        setTime(0)
        setTimer(setInterval(() => {
            setTime(time => time + 1)
        }, timerInterval))
    }, [setTime, timer, setTimer, timerInterval])

    const stopTimer = React.useCallback((resetTime?: boolean): number => {
        if (timer)
            clearInterval(timer)
        setTimer(undefined)
        if (resetTime)
            setTime(0)

        return time
    }, [timer, setTimer, setTime])

    const resetTime = React.useCallback((to?: number) => {
        if(isNumber(to))
            setTime(to)
        else
            setTime(0)
    }, [setTime])

    const isActive = React.useCallback(() => timer != undefined, [timer])

    return [time, startTimer, stopTimer, isActive, resetTime]
}