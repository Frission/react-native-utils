
export const MonthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
]

export const MonthNamesShort = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
]

/** month index starts from 0 */
export const getShortMonthName = (month: number): string => {
    const m = month % 12
    return MonthNamesShort[m]
}

/** month index starts from 0 */
export const getMonthName = (month: number): string => {
    const m = month % 12
    return MonthNames[m]
}

/**
 * 
 */
export const getReadableDateFromISOFormat = (isoFormattedDate: string): string => {
    const date = new Date(isoFormattedDate)

    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`
}

export const getReadableDate = (unixTime: number | null) => {
    if (unixTime == null)
        return ""

    const date = new Date(unixTime)

    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
}

export const getReadableTime = (unixTime: number | null) => {
    if (unixTime == null)
        return ""

    const date = new Date(unixTime)

    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}

export const getReadableDateAndTime = (unixTime: number | null) => {
    if (unixTime == null)
        return ""

    const date = new Date(unixTime)

    return `${getReadableDate(unixTime)} ${getReadableTime(unixTime)}`
}

export const getReadableDateMonthAndTime = (unixTime: number | null, includeYear: boolean = false) => {
    if (unixTime == null)
        return ""

    const date = new Date(unixTime)
    const year = includeYear ? `${date.getFullYear()} ` : ""

    return `${date.getDate().toString().padStart(2, "0")} ${getMonthName(date.getMonth())} ${year}` +
        `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}

/**
 * @param seconds seconds
 * @returns seconds formatted as HH:mm:ss
 */
export const getHourMinSecString = (seconds: number): string => {
    const hours = Math.floor(((seconds / 3600) % 100)).toFixed(0).toString().padStart(2, "0")
    const minutes = Math.floor(((seconds % 3600) / 60)).toFixed(0).toString().padStart(2, "0")
    const _seconds = Math.floor((seconds % 60)).toFixed(0).toString().padStart(2, "0")

    return `${hours}:${minutes}:${_seconds}`
}