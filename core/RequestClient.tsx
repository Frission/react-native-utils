import { devlog } from "@/util/devlog";
import axios, { AxiosError, AxiosHeaderValue, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken, CancelTokenSource, RawAxiosRequestHeaders } from "axios";
import { DEVELOPMENT_BASE_URL, PRODUCTION_BASE_URL } from "../constants";
import { delay } from "@/util/miscUtils";
import { HTTP403 } from "../errors/HTTPErrors";

export type Response<T> = AxiosResponse<T>
export type RequestConfig = AxiosRequestConfig & {
    authorized?: boolean,
    isRetryAfterRefresh?: boolean,
    retryCount?: number
}
export type FileUpload = { uri: string, name: string, type: string }

const refreshTokenRoute = "auth/sign-in/refresh"

namespace RequestClient {

    const logResponses = false
    const logRequests = false

    let axiosInstance: AxiosInstance | null = null

    let authorizationToken: string | null = null
    let refreshTokenPromise: Promise<AxiosResponse<any, any>> | null = null

    let initializationPromiseResolver: ((value?: unknown) => void) | null = null

    const getInstance = () => {
        if (axiosInstance === null)
            refreshInstance()

        return axiosInstance as AxiosInstance
    }

    export const ensureInitialized = () => {
        if (axiosInstance != null)
            return Promise.resolve()
        else
            return new Promise((resolve) => {
                initializationPromiseResolver = resolve
            })
    }

    export const setAuthToken = (token: string | null) => {
        authorizationToken = token
    }

    export const get = async <T>(endpoint: string, config?: RequestConfig): Promise<Response<T>> => {
        devlog("get request: " + endpoint)

        return await getInstance().get(endpoint, config)
    }

    export const getForResponse = async <T>(endpoint: string, config?: RequestConfig): Promise<AxiosResponse<T>> => {
        devlog("get request: " + endpoint)

        return await getInstance().get(endpoint, config)
    }

    export const post = async <T>(endpoint: string, data?: any, config?: RequestConfig): Promise<Response<T>> => {
        devlog("post request: " + endpoint)

        let reqConfig: RequestConfig = { ...config, headers: { ...config?.headers } }

        if (data != null && reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await getInstance().post(endpoint, data, reqConfig)
    }

    export const postForResponse = async <T>(endpoint: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>> => {
        devlog("post request: " + endpoint)

        let reqConfig: RequestConfig = { ...config, headers: { ...config?.headers } }

        if (data != null && reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await getInstance().post(endpoint, data, reqConfig)
    }

    export const put = async <T>(endpoint: string, data: any, config?: RequestConfig): Promise<Response<T>> => {
        devlog("put request: " + endpoint)

        let reqConfig: RequestConfig = { ...config, headers: { ...config?.headers } }

        if (reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await getInstance().put(endpoint, data, reqConfig)
    }

    export const putForResponse = async <T>(endpoint: string, data: any, config?: RequestConfig): Promise<AxiosResponse<T>> => {
        devlog("put request: " + endpoint)

        let reqConfig: RequestConfig = { ...config, headers: { ...config?.headers } }

        if (reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await getInstance().put(endpoint, data, reqConfig)
    }

    export const _delete = async <T>(endpoint: string, config?: RequestConfig): Promise<Response<T>> => {
        devlog("delete request: " + endpoint)

        return await getInstance().delete(endpoint, config)
    }

    export const deleteForResponse = async <T>(endpoint: string, config?: RequestConfig): Promise<AxiosResponse<T>> => {
        devlog("delete request: " + endpoint)

        return await getInstance().delete(endpoint, config)
    }

    export const putForm = async <T>(
        endpoint: string,
        formData: FormData,
        config?: RequestConfig
    ): Promise<Response<T>> => {
        const multipartConfig = { ...config, headers: { ...config?.headers, "Content-Type": "multipart/form-data" } }
        return getInstance().putForm(endpoint, formData, multipartConfig)
    }

    export const putFormForResponse = async <T>(
        endpoint: string,
        formData: FormData,
        config?: RequestConfig
    ): Promise<AxiosResponse<T>> => {
        const multipartConfig = { ...config, headers: { ...config?.headers, "Content-Type": "multipart/form-data" } }
        return getInstance().putForm(endpoint, formData, multipartConfig)
    }


    //#region Requests with different base URLs

    export const getFrom = async <R>(baseUrl: string, config?: RequestConfig): Promise<AxiosResponse<R>> => {
        try {
            devlog("get request: " + baseUrl)

            return await axios.get(baseUrl, { ...config })
        } catch (err) {
            return await handleResponseError(err as AxiosError)
        }
    }

    export const postTo = async <R>(baseUrl: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<R>> => {
        try {
            if (!config)
                config = { headers: {} }
            else
                config = { ...config, headers: { ...config?.headers } }

            if (config.headers && !config.headers["Content-Type"]) {
                config.headers["Content-Type"] = "application/json"
            }

            devlog("post request: " + baseUrl)

            return await axios.post(baseUrl, data, config)
        } catch (err) {
            return await handleResponseError(err as AxiosError)
        }
    }

    //#endregion

    export const setDefaultHeader = (key: string, value: AxiosHeaderValue) => {
        if (axiosInstance != null)
            axiosInstance.defaults.headers.common[key] = value
    }

    const prepareHeaders = async (config?: RequestConfig): Promise<RawAxiosRequestHeaders> => {
        let headers: RawAxiosRequestHeaders = config?.headers ?? {}

        // by default every request will be made with an authorization header
        if (config?.authorized == null || config.authorized == true) {
            //authorizationToken = await getUserToken()

            if (authorizationToken != null) {
                headers.Authorization = authorizationToken
            }
        }

        return headers
    }

    export const createInstance = (isDev: boolean) => {
        if (axiosInstance !== null)
            return

        if (isDev) {
            devlog(" -- creating development instance for axios -- ");
            axiosInstance = axios.create({
                baseURL: DEVELOPMENT_BASE_URL,
                timeout: 15000,
            })
        }
        else {
            devlog(" -- creating production instance for axios -- ");
            axiosInstance = axios.create({
                baseURL: PRODUCTION_BASE_URL,
                timeout: 15000,
            })
        }

        axiosInstance.defaults.headers.common["Accept-Language"] = "en-GB"

        // Request Interceptor

        axiosInstance.interceptors.request.use(
            async (config) => {

                const headers = await prepareHeaders(config)
                for (let header of Object.entries(headers)) {
                    config.headers.set(header[0], header[1])
                }

                if (logRequests)
                    devlog(config)

                return config
            },
            handleResponseError
        );

        // Response Interceptor

        axiosInstance.interceptors.response.use(
            async (response) => {

                if (logResponses)
                    devlog(response.data)

                if ((response.config as RequestConfig).isRetryAfterRefresh == true && refreshTokenPromise != null) {
                    refreshTokenPromise = null
                }

                return response
            },
            handleResponseError
        );

        if (initializationPromiseResolver != null) {
            initializationPromiseResolver()
            initializationPromiseResolver = null
        }
    }

    /**  is a different value in here */
    const handleResponseError = async (error: AxiosError) => {
        if (error.response == null) {
            devlog("request error: no response. request cancelled?")

            // retry requests with no response, network failure?
            if (((error.config as RequestConfig)?.retryCount ?? 0) > 0) {
                return await retryRequest(error)
            }
        } else {
            devlog("request error: " + error?.config?.url, "\nhttp code: " + error?.response?.status, "\nmethod: " + error.config?.method)

            // no status means a network error or an unknown error occurred, we should retry this request below
            const status = error?.response?.status ?? 600

            if (error.config != null) {
                // if this is a repeated request after a new token was retrieved, try again
                if ((error.config as RequestConfig).isRetryAfterRefresh !== true &&
                    (error.config as RequestConfig).authorized !== false &&
                    status == 403 &&
                    error.config?.url != refreshTokenRoute) {
                    return await retryAfterRefresh(error.config)
                }

                // retry requests with retry count and a 500+ or 0 error, status 0 means network error
                if ((status >= 500 || status == 0) && ((error.config as RequestConfig)?.retryCount ?? 0) > 0) {
                    return await retryRequest(error)
                }
            }

            if (error?.response?.data) {
                devlog(error.response.data)
                return Promise.reject(error.response.data)
            } else {
                return Promise.reject(error.message)
            }
        }

        return Promise.reject(error)
    }

    const retryAfterRefresh = async (config: RequestConfig) => {
        if (refreshTokenPromise == null) {
            refreshTokenPromise = new Promise(async (resolve, reject) => {
                try {

                    // try to refresh token, and if it succeeds set them into async storage and retry request
                    const refreshTokenResult = await post<{ token?: string }>(refreshTokenRoute)

                    if (refreshTokenResult.status == 200 && refreshTokenResult.data?.token != null) {
                        setAuthToken(refreshTokenResult.data.token)

                        const originalRequest: RequestConfig = { ...config, isRetryAfterRefresh: true }
                        return resolve(await getInstance()(originalRequest))
                    }
                } catch (err) {
                    return reject(HTTP403)
                }
            })

            return refreshTokenPromise
        } else if (refreshTokenPromise) {
            // another request is already trying to refresh the user token, wait for it
            await refreshTokenPromise
            refreshTokenPromise = null

            const originalRequest = { ...config, retry: true }
            return await getInstance()(originalRequest)
        }

        return Promise.reject()
    }

    const retryRequest = async (error: AxiosError) => {
        await delay(500)
        devlog("retries left:", ((error.config as RequestConfig)?.retryCount ?? 1) - 1, "for", error?.config?.url)
        const originalRequest: RequestConfig = {
            ...error.config,
            retryCount: ((error.config as RequestConfig)?.retryCount ?? 1) - 1
        }
        return await getInstance()(originalRequest)
    }

    /**
    * For Hot Reload
    */
    const refreshInstance = () => {
        try {
            const isDev = process.env.NODE_ENV == "development"
            createInstance(isDev)
        } catch (err) {
            createInstance(false)
        }
    }
}

export const initializeRequestClient = async () => {
    const isDev = process.env.NODE_ENV == "development"
    RequestClient.createInstance(isDev)
}

export default RequestClient
