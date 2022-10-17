
/** adjusted to TR locale */
export const printFloat = (float: number | null | undefined, fixed?: number, padStart?: boolean): string | undefined => {
    if (float == null)
        return undefined

    // the + in front of float removes the trailing zeroes, for example 1.234000 becomes 1.234
    let f = fixed ? (+float.toFixed(fixed)).toString() : float.toString()

    if (fixed && padStart == true)
        f = f.padStart(fixed, "0")

    f = f.replace(".", ",")
    return f
}

export const joinStrings = (...strings: Array<string | boolean | undefined>): string | undefined => {
    const filters = strings.filter(str => str != null && str != "" && str != false && str != true)

    if (filters.length == 0)
        return undefined
    else
        return filters.join(", ")
}

export const currentTimeInMillis = (): number => {
    const date = new Date()
    const time: number = date.getTime() + -1 * 60 * 1000 * date.getTimezoneOffset()
    return time
}

/**
 * characters are treated as single char strings in javascript, so we substract them like this
 * @param firstChar a character
 * @param secondChar a character
 * @returns different in ascii codes as a number
 */
export const asciiSub = (firstChar: string, secondChar: string): number => {
    return firstChar.charCodeAt(0) - secondChar.charCodeAt(0);
}

export const SafeLayoutAnimation = {
    easeOut: (duration: number = 400) => {
        LayoutAnimation.configureNext({
            duration,
            create: {
                type: LayoutAnimation.Types.easeOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeOut,
            },
            /* Do not define delete, causes crashes on Android */
        })
    },

    /** Will cause CRASHES on Android during fast animations, or animations that affect a lot of views 
    _unsafeEaseOutDelete: (duration: number = 400) => {
        LayoutAnimation.configureNext({
            duration,
            create: {
                type: LayoutAnimation.Types.easeOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeOut,
            },
            delete: {
                type: LayoutAnimation.Types.easeOut,
                property: LayoutAnimation.Properties.opacity,
            }
        })
    }
    */
}