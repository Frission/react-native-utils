import type { AxiosError } from "axios"

export interface ApiError {
    message: string | undefined
    data?: any
    status: number | undefined
    code: string | undefined
    suggestions?: string[]
    originalError?: Error
}

export class RequestError extends Error {
    status: number | undefined
    code: string | undefined

    constructor(message?: string, status?: number, code?: string) {
        super(message ?? "Bilinmeyen bir hata meydana geldi.")
        this.status = status
        this.code = code
    }

    public static fromAxiosResponse(err: Partial<AxiosError<any>>) {
        if (err?.response?.data?.error != null) {
            return new RequestError(err.response.data.error.message, err.response.status, err.response.data.error.code)
        } else if (err.response != null) {
            return new RequestError(err.message, err.response.status)
        } else {
            return new RequestError(err.message)
        }
    }

    public static fromUnknownError(err: any) {
        if (this.isApiError(err)) {
            return new RequestError(err.message, err.status, err.code)
        } else if (err.message != null) {
            return new RequestError(err.message)
        } else {
            return new RequestError()
        }
    }

    private static isApiError(err: unknown): err is ApiError {
        return typeof err === "object" && (err as ApiError)?.message != null
    }
}
