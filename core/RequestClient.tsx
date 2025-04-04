import axios, {
    AxiosError,
    AxiosHeaderValue,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CreateAxiosDefaults,
    RawAxiosRequestHeaders,
} from "axios"
import { ApiError, RequestError } from "./RequestError"

export type Response<T = any> = AxiosResponse<ApiResponse<T>>
export type FileUpload = { uri: string; name: string; type: string }
export interface RequestClientConfig extends CreateAxiosDefaults {
    baseURL: string
    headers?: Record<string, string>
    onAuthenticationError?: (error: unknown) => void
    refreshTokenRoute: string
    refreshTokenRequest: (
        client: typeof RequestClient,
        refreshToken: string,
    ) => Promise<{ accessToken?: string; refreshToken?: string }>
    storage: Storage
}

export type ApiResponse<T = any> = {
    success: boolean
    document?: T
    documents?: T[]
    total?: number
    results?: number
    page?: number
    limit?: number
    _results?: number
    error?: ApiError
}

export interface Storage {
    getAccessToken: () => string | null | undefined
    getRefreshToken: () => string | null | undefined
    setAccessToken: (token: string) => void
    setRefreshToken: (token: string) => void
}

const devlog = (...messages: Array<any>) => {
    if (import.meta.env.DEV == true) console.log(...messages)
}

const delay = (byMillis: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), byMillis)
    })
}

export const initializeRequestClient = (config: RequestClientConfig) => {
    RequestClient.createInstance(config)
    return RequestClient.getInstance()
}

namespace RequestClient {
    const logResponses = false
    const logRequests = false

    let axiosInstance: AxiosInstance | null = null
    let clientConfig: RequestClientConfig | undefined = undefined

    let refreshTokenPromise: Promise<AxiosResponse<any, any>> | null = null

    let initializationPromiseResolver: ((value?: unknown) => void) | null = null

    export const getInstance = () => {
        if (axiosInstance === null) refreshInstance()

        return axiosInstance as AxiosInstance
    }

    export const ensureInitialized = () => {
        if (axiosInstance != null) return Promise.resolve()
        else
            return new Promise(resolve => {
                initializationPromiseResolver = resolve
            })
    }

    export const get = async <T>(endpoint: string, config?: AxiosRequestConfig<T>): Promise<Response<T>> => {
        devlog("get request: " + endpoint)

        return await getInstance().get(endpoint, config)
    }

    export const getForResponse = async <T>(
        endpoint: string,
        config?: AxiosRequestConfig<T>,
    ): Promise<AxiosResponse<T>> => {
        devlog("get request: " + endpoint)

        return await getInstance().get(endpoint, config)
    }

    export const post = async <T>(
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig<T>,
    ): Promise<Response<T>> => {
        devlog("post request: " + endpoint)

        const reqConfig: AxiosRequestConfig<T> = { ...config, headers: { ...config?.headers } }

        if (data != null && reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await getInstance().post(endpoint, data, reqConfig)
    }

    export const postForResponse = async <T>(
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig<T>,
    ): Promise<AxiosResponse<T>> => {
        devlog("post request: " + endpoint)

        const reqConfig: AxiosRequestConfig<T> = { ...config, headers: { ...config?.headers } }

        if (data != null && reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await getInstance().post(endpoint, data, reqConfig)
    }

    export const put = async <T>(endpoint: string, data: any, config?: AxiosRequestConfig<T>): Promise<Response<T>> => {
        devlog("put request: " + endpoint)

        const reqConfig: AxiosRequestConfig<T> = { ...config, headers: { ...config?.headers } }

        if (reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await getInstance().put(endpoint, data, reqConfig)
    }

    export const putForResponse = async <T>(
        endpoint: string,
        data: any,
        config?: AxiosRequestConfig<T>,
    ): Promise<AxiosResponse<T>> => {
        devlog("put request: " + endpoint)

        const reqConfig: AxiosRequestConfig<T> = { ...config, headers: { ...config?.headers } }

        if (reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await getInstance().put(endpoint, data, reqConfig)
    }

    export const _delete = async <T>(endpoint: string, config?: AxiosRequestConfig<T>): Promise<Response<T>> => {
        devlog("delete request: " + endpoint)

        return await getInstance().delete(endpoint, config)
    }

    export const deleteForResponse = async <T>(
        endpoint: string,
        config?: AxiosRequestConfig<T>,
    ): Promise<AxiosResponse<T>> => {
        devlog("delete request: " + endpoint)

        return await getInstance().delete(endpoint, config)
    }

    export const putForm = async <T extends FormData>(
        endpoint: string,
        formData: FormData,
        config?: AxiosRequestConfig<T>,
    ): Promise<Response<T>> => {
        const multipartConfig = { ...config, headers: { ...config?.headers, "Content-Type": "multipart/form-data" } }
        return getInstance().putForm(endpoint, formData, multipartConfig)
    }

    export const putFormForResponse = async <T extends FormData>(
        endpoint: string,
        formData: FormData,
        config?: AxiosRequestConfig<T>,
    ): Promise<AxiosResponse<T>> => {
        const multipartConfig = { ...config, headers: { ...config?.headers, "Content-Type": "multipart/form-data" } }
        return getInstance().putForm(endpoint, formData, multipartConfig)
    }

    export const getFrom = async <R>(baseUrl: string, config?: AxiosRequestConfig<R>): Promise<AxiosResponse<R>> => {
        try {
            devlog("get request: " + baseUrl)

            return await axios.get(baseUrl, { ...config })
        } catch (err: any) {
            return await handleResponseError(err)
        }
    }

    export const postTo = async <R>(
        baseUrl: string,
        data?: any,
        config?: AxiosRequestConfig<R>,
    ): Promise<AxiosResponse<R>> => {
        try {
            if (!config) config = { headers: {} }
            else config = { ...config, headers: { ...config?.headers } }

            if (config.headers && !config.headers["Content-Type"]) {
                config.headers["Content-Type"] = "application/json"
            }

            devlog("post request: " + baseUrl)

            return await axios.post(baseUrl, data, config)
        } catch (err: any) {
            return await handleResponseError(err)
        }
    }

    //#endregion

    export const changeAcceptLanguage = async (language: string) => {
        await ensureInitialized()
        getInstance().defaults.headers.common["Accept-Language"] = language
    }

    export const setDefaultHeader = (key: string, value: AxiosHeaderValue) => {
        if (axiosInstance != null) axiosInstance.defaults.headers.common[key] = value
    }

    const prepareHeaders = async <T>(config?: AxiosRequestConfig<T>): Promise<RawAxiosRequestHeaders> => {
        const headers: RawAxiosRequestHeaders = config?.headers ?? {}

        // by default every request will be made with an authorization header
        if (config?.authorized == null || config.authorized == true) {
            const accessToken = clientConfig?.storage.getAccessToken()
            if (accessToken != null) {
                headers.Authorization = `Bearer ${accessToken}`
            }
        }

        return headers
    }

    export const createInstance = (cfg?: RequestClientConfig) => {
        if (axiosInstance !== null) return

        clientConfig = cfg

        axiosInstance = axios.create({
            baseURL: cfg?.baseURL,
            timeout: 25000,
        })

        axiosInstance.defaults.headers.common["Accept-Language"] = "en-GB"
        for (let header in cfg?.headers) {
            axiosInstance.defaults.headers.common[header] = cfg.headers[header]
        }

        // Request Interceptor

        axiosInstance.interceptors.request.use(async config => {
            const headers = await prepareHeaders(config)
            for (const header of Object.entries(headers)) {
                config.headers.set(header[0], header[1])
            }

            if (logRequests) devlog(config)

            return config
        }, handleResponseError)

        // Response Interceptor

        axiosInstance.interceptors.response.use(async response => {
            if (logResponses) devlog(response.data)

            if ((response.config as AxiosRequestConfig).isRetryAfterRefresh == true && refreshTokenPromise != null) {
                refreshTokenPromise = null
            }

            return response
        }, handleResponseError)

        if (initializationPromiseResolver != null) {
            initializationPromiseResolver()
            initializationPromiseResolver = null
        }
    }

    /**  is a different value in here */
    const handleResponseError = async (error: Partial<AxiosError<ApiResponse>>) => {
        if (error.response == null) {
            devlog("request error: no response. request cancelled?")

            // retry requests with no response, network failure?
            if ((error.config?.retryCount ?? 0) > 0) {
                return await retryRequest(error as AxiosError<ApiResponse>)
            }
        } else {
            devlog(
                "request error: " + error?.config?.url,
                "\nhttp code: " + error?.response?.status,
                "\nmethod: " + error.config?.method,
            )

            // no status means a network error or an unknown error occurred, we should retry this request below
            const status = error?.response?.status ?? 600

            if (error.config != null) {
                // if this is a repeated request after a new token was retrieved, try again
                if (
                    error.config?.isRetryAfterRefresh !== true &&
                    error.config?.authorized !== false &&
                    status == 401 &&
                    error.config?.url != clientConfig?.refreshTokenRoute
                ) {
                    devlog("retry request", error.config.url)
                    return await retryAfterRefresh(error.config)
                }

                // retry requests with retry count and a 500+ or 0 error, status 0 means network error
                if ((status >= 500 || status == 0) && (error.config?.retryCount ?? 0) > 0) {
                    return await retryRequest(error as AxiosError<ApiResponse>)
                }

                if (error.config.isRetryAfterRefresh && error.config.authorized) {
                    clientConfig?.onAuthenticationError?.(error.config.data)
                }
            }
        }

        return Promise.reject(RequestError.fromAxiosResponse(error))
    }

    const retryAfterRefresh = async <T>(config: AxiosRequestConfig<T>) => {
        if (refreshTokenPromise == null) {
            // eslint-disable-next-line no-async-promise-executor
            refreshTokenPromise = new Promise(async (resolve, reject) => {
                try {
                    devlog("send refresh request")

                    const refreshToken = clientConfig!.storage.getRefreshToken()

                    if (refreshToken == null) throw Error("refresh token was null")

                    // try to refresh token, and if it succeeds set them into async storage and retry request
                    const refreshTokenResult = await clientConfig?.refreshTokenRequest(RequestClient, refreshToken)

                    if (refreshTokenResult?.accessToken != null && refreshTokenResult?.refreshToken != null) {
                        clientConfig!.storage.setAccessToken(refreshTokenResult.accessToken)
                        clientConfig!.storage.setRefreshToken(refreshTokenResult.refreshToken)

                        const originalRequest: AxiosRequestConfig = { ...config, isRetryAfterRefresh: true }
                        return resolve(await getInstance()(originalRequest))
                    }
                } catch (err) {
                    refreshTokenPromise = null

                    clientConfig?.onAuthenticationError?.(err)

                    devlog("rejecting with 401")
                    return reject({ message: "Unauthorized", code: 401 })
                }
            })

            return refreshTokenPromise
        } else if (refreshTokenPromise) {
            // another request is already trying to refresh the user token, wait for it
            await refreshTokenPromise
            refreshTokenPromise = null

            const originalRequest = { ...config, isRetryAfterRefresh: true }
            return await getInstance()(originalRequest)
        }

        return Promise.reject()
    }

    const retryRequest = async (error: AxiosError) => {
        await delay(500)
        devlog("retries left:", (error.config?.retryCount ?? 1) - 1, "for", error?.config?.url)
        const originalRequest: AxiosRequestConfig = {
            ...error.config,
            retryCount: (error.config?.retryCount ?? 1) - 1,
        }
        return await getInstance()(originalRequest)
    }

    /**
     * For Hot Reload
     */
    const refreshInstance = () => {
        createInstance(clientConfig)
    }
}

export default RequestClient
