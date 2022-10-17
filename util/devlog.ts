
/**
 * Don't need log messages in the release build
 */
export default (...messages: any) => {
    if (__DEV__)
        console.log.apply(console, messages)
}

export const devlogWarn = (...messages: any) => {
    if (__DEV__)
        console.warn.apply(console, messages)
}

export const devlogError = (...messages: any) => {
    if (__DEV__)
        console.error.apply(console, messages)
}