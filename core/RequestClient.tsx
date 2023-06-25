import axios, { AxiosError, AxiosHeaderValue, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken, CancelTokenSource, RawAxiosRequestHeaders } from "axios";
import type { ApiResponse } from "../data/model/response/util/ApiResponse";
import devlog from "../../util/devlog";
import { getIsDev, getRefreshToken, getUserToken, setIsDev, setRefreshToken, setUserToken } from "../asyncStorageHelpers";
import { PLATFORM_OS_FORMATTED, DEVELOPMENT_BASE_URL, PRODUCTION_BASE_URL, PLATFORM_VERSION, PRODUCTION_HOST, DEVELOPMENT_HOST } from "../constants";
import { API_CLIENT_KEY } from "../keys";
import { Banking403, HTTP403 } from "./HttpErrors";
import type LoginResponse from "../data/model/response/auth/LoginResponse";
import { delay } from "../../util/miscUtils";
import { AppEnvironment } from "../../util/environmentUtils";
import { ErrorMonitoring } from "../../util/monitoring/ErrorMonitoring";

export type Response<T> = AxiosResponse<ApiResponse<T>>
export type RequestConfig = AxiosRequestConfig & {
    authorized?: boolean,
    isRetryAfterRefresh?: boolean,
    retryCount?: number,
    bankingAuthorized?: boolean
}
export type FileUpload = { uri: string, name: string, type: string }

const refreshTokenRoute = "auth/sign-in/refresh"

class RequestClient {

    public static logResponses = false
    public static logRequests = false

    private static axiosInstance: AxiosInstance | null = null
    private static cancelTokenSources: Map<string, CancelTokenSource> = new Map<string, CancelTokenSource>()

    private static authorizationToken: string | null = null
    private static refreshTokenPromise: Promise<AxiosResponse<any, any>> | null = null

    private static initializationPromiseResolver: ((value?: unknown) => void) | null = null

    private constructor() { }

    public static async getInstance() {
        if (this.axiosInstance === null)
            await this.refreshInstace()

        return Promise.resolve(this.axiosInstance as AxiosInstance)
    }

    public static async ensureInitialized() {
        if (this.axiosInstance != null)
            return Promise.resolve()
        else
            return new Promise((resolve) => {
                this.initializationPromiseResolver = resolve
            })
    }

    public static async setAuthToken(token: string | null) {
        this.authorizationToken = token
    }

    public static async get<T>(endpoint: string, config?: RequestConfig): Promise<Response<T>> {
        devlog("get request: " + endpoint)

        return await (await this.getInstance()).get(endpoint, config)
    }

    public static async getForResponse<T>(endpoint: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
        devlog("get request: " + endpoint)

        return await (await this.getInstance()).get(endpoint, config)
    }

    public static async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<Response<T>> {
        devlog("post request: " + endpoint)

        let reqConfig: RequestConfig = { ...config, headers: { ...config?.headers } }

        if (data != null && reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await (await this.getInstance()).post(endpoint, data, reqConfig)
    }

    public static async postForResponse<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<T>> {
        devlog("post request: " + endpoint)

        let reqConfig: RequestConfig = { ...config, headers: { ...config?.headers } }

        if (data != null && reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await (await this.getInstance()).post(endpoint, data, reqConfig)
    }

    public static async put<T>(endpoint: string, data: any, config?: RequestConfig): Promise<Response<T>> {
        devlog("put request: " + endpoint)

        let reqConfig: RequestConfig = { ...config, headers: { ...config?.headers } }

        if (reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await (await this.getInstance()).put(endpoint, data, reqConfig)
    }

    public static async putForResponse<T>(endpoint: string, data: any, config?: RequestConfig): Promise<AxiosResponse<T>> {
        devlog("put request: " + endpoint)

        let reqConfig: RequestConfig = { ...config, headers: { ...config?.headers } }

        if (reqConfig.headers != null && !reqConfig.headers?.["Content-Type"]) {
            reqConfig.headers["Content-Type"] = "application/json"
        }

        return await (await this.getInstance()).put(endpoint, data, reqConfig)
    }

    public static async delete<T>(endpoint: string, config?: RequestConfig): Promise<Response<T>> {
        devlog("delete request: " + endpoint)

        return await (await this.getInstance()).delete(endpoint, config)
    }

    public static async deleteForResponse<T>(endpoint: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
        devlog("delete request: " + endpoint)

        return await (await this.getInstance()).delete(endpoint, config)
    }

    public static async postFile<T>(
        endpoint: string,
        file: FileUpload,
        formDataName: string = "file",
        config?: RequestConfig
    ): Promise<Response<T>> {
        let formData = new FormData()
        formData.append(formDataName, file)

        const multipartConfig = {
            ...config,
            headers: {
                ...config?.headers,
                "Content-Type": "multipart/form-data"
            }
        }

        return (await this.getInstance()).postForm(endpoint, formData, multipartConfig)
    }

    public static async putFile<T>(
        endpoint: string,
        file: FileUpload,
        formDataName: string = "file",
        config?: RequestConfig
    ): Promise<Response<T>> {
        let formData = new FormData()
        formData.append(formDataName, file)

        const multipartConfig = {
            ...config,
            headers: {
                ...config?.headers,
                "Content-Type": "multipart/form-data"
            }
        }

        return (await this.getInstance()).putForm(endpoint, formData, multipartConfig)
    }

    public static async putForm<T>(
        endpoint: string,
        formData: FormData,
        config?: RequestConfig
    ): Promise<Response<T>> {
        const multipartConfig = { ...config, headers: { ...config?.headers, "Content-Type": "multipart/form-data" } }
        return (await this.getInstance()).putForm(endpoint, formData, multipartConfig)
    }

    public static async putFormForResponse<T>(
        endpoint: string,
        formData: FormData,
        config?: RequestConfig
    ): Promise<AxiosResponse<T>> {
        const multipartConfig = { ...config, headers: { ...config?.headers, "Content-Type": "multipart/form-data" } }
        return (await this.getInstance()).putForm(endpoint, formData, multipartConfig)
    }


    //#region Requests with different base URLs

    public static async getFrom<R>(baseUrl: string, config?: RequestConfig): Promise<AxiosResponse<R>> {
        try {
            devlog("get request: " + baseUrl)

            return await axios.get(baseUrl, { ...config })
        } catch (err) {
            return await this.handleResponseError(err as AxiosError)
        }
    }

    public static async postTo<R>(baseUrl: string, data?: any, config?: RequestConfig): Promise<AxiosResponse<R>> {
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
            return await this.handleResponseError(err as AxiosError)
        }
    }

    //#endregion


    public static getBaseURL(): string {
        if (this.axiosInstance === null || !this.axiosInstance.defaults.baseURL)
            return PRODUCTION_BASE_URL
        else
            return this.axiosInstance.defaults.baseURL
    }

    public static setDefaultHeader(key: string, value: AxiosHeaderValue) {
        if (this.axiosInstance != null)
            this.axiosInstance.defaults.headers.common[key] = value
    }

    private static async prepareHeaders(config?: RequestConfig): Promise<RawAxiosRequestHeaders> {
        let headers: RawAxiosRequestHeaders = config?.headers ?? {}

        // by default every request will be made with an authorization header
        if (config?.authorized == null || config.authorized == true) {
            this.authorizationToken = await getUserToken()

            if (this.authorizationToken != null) {
                headers.Authorization = this.authorizationToken
            }
        }

        return headers
    }

    public static createInstance(isDev: boolean) {
        if (this.axiosInstance !== null)
            return

        if (isDev) {
            devlog(" -- creating development instance for axios -- ");
            this.axiosInstance = axios.create({
                baseURL: DEVELOPMENT_BASE_URL,
                timeout: 15000,
            })
            this.axiosInstance.defaults.headers.common.Host = DEVELOPMENT_HOST
        }
        else {
            devlog(" -- creating production instance for axios -- ");
            this.axiosInstance = axios.create({
                baseURL: PRODUCTION_BASE_URL,
                timeout: 15000,
            })
            this.axiosInstance.defaults.headers.common.Host = PRODUCTION_HOST
        }

        this.axiosInstance.defaults.headers.common["Accept-Language"] = "tr-TR"
        this.axiosInstance.defaults.headers.common["X-Moneye-API-Client-Key"] = API_CLIENT_KEY
        this.axiosInstance.defaults.headers.common["X-Moneye-APP-Version"] = "1.0.30"
        this.axiosInstance.defaults.headers.common["X-Moneye-APP-Platform"] = PLATFORM_OS_FORMATTED
        this.axiosInstance.defaults.headers.common["X-Moneye-APP-OS"] = PLATFORM_VERSION


        // Request Interceptor

        this.axiosInstance.interceptors.request.use(
            async (config) => {

                const headers = await this.prepareHeaders(config)
                for (let header of Object.entries(headers)) {
                    config.headers.set(header[0], header[1])
                }

                if (this.logRequests)
                    devlog(config)

                return config
            },
            this.handleResponseError
        );

        // Response Interceptor

        this.axiosInstance.interceptors.response.use(
            async (response) => {

                if (this.logResponses)
                    devlog(response.data)

                if ((response.config as RequestConfig).isRetryAfterRefresh == true && RequestClient.refreshTokenPromise != null) {
                    RequestClient.refreshTokenPromise = null
                }

                return response
            },
            this.handleResponseError
        );

        if (this.initializationPromiseResolver != null) {
            this.initializationPromiseResolver()
            this.initializationPromiseResolver = null
        }
    }

    /**
     * Creates a cancel token tag, or refreshes it if a token by this tag exists, refreshing a token wil invalidate the old one
     *
     * @param tag Has to be unique
     * @returns The created cancel token, it's more convenient to get this by using getCancelToken tag later on
     */
    public static createCancelToken(tag: string): CancelToken {
        const source = axios.CancelToken.source()
        this.cancelTokenSources.set(tag, source)
        return source.token
    }

    /**
     * Please be aware that if you call createCancelToken, the token will be refreshed, so this method must be called again to
     * get the up-to-date token
     *
     * @param tag Tag of the token
     * @returns The up-to-date cancel token
     */
    public static getCancelToken(tag: string): CancelToken | undefined {
        return this.cancelTokenSources.get(tag)?.token
    }

    /** A cancel token by this tag name must have been created */
    public static cancelRequestsByTagOnce(tag: string) {
        devlog(`Requests tagged "${tag}" are cancelled.`)
        this.cancelTokenSources.get(tag)?.cancel(`Requests tagged ${tag} are cancelled.`)
        this.createCancelToken(tag)
    }

    public static cancelRequestsByTagAndRemove(tag: string) {
        devlog(`Requests tagged "${tag}" are cancelled.`)
        this.cancelTokenSources.get(tag)?.cancel(`Requests tagged ${tag} are cancelled.`)
        this.removeCancelToken(tag)
    }

    public static preventRequestsByTag(tag: string) {
        if (this.cancelTokenSources.has(tag)) {
            devlog(`Requests tagged "${tag}" will be prevented from sending until a new token creation, or removal.`)
            this.cancelTokenSources.get(tag)?.cancel(`Requests tagged "${tag}" will be prevented from sending.`)
        }
    }

    public static releaseRequestsByTag(tag: string) {
        if (this.cancelTokenSources.has(tag))
            this.createCancelToken(tag)
    }

    public static removeCancelToken(tag: string) {
        if (this.cancelTokenSources.has(tag))
            this.cancelTokenSources.delete(tag)
    }

    /** this. is a different value in here */
    private static async handleResponseError(error: AxiosError) {
        if (error.response == null) {
            devlog("request error: no response. request cancelled?")

            // retry requests with no response, network failure?
            if (((error.config as RequestConfig)?.retryCount ?? 0) > 0) {
                return await RequestClient.retryRequest(error)
            }
        } else {
            devlog("request error: " + error?.config?.url, "\nhttp code: " + error?.response?.status, "\nmethod: " + error.config?.method)

            ErrorMonitoring.logRequestError(error)

            // no status means a network error or an unknown error occurred, we should retry this request below
            const status = error?.response?.status ?? 600

            if (error.config != null) {
                // if this is a repeated request after a new token was retrieved, try again
                if ((error.config as RequestConfig).isRetryAfterRefresh !== true &&
                    (error.config as RequestConfig).authorized !== false &&
                    (error.config as RequestConfig).bankingAuthorized !== true &&
                    status == 403 &&
                    error.config?.url != refreshTokenRoute) {
                    return await RequestClient.retryAfterRefresh(error.config)
                }

                if ((error.config as RequestConfig).bankingAuthorized === true && status == 403)
                    return Promise.reject(Banking403)

                // retry requests with retry count and a 500+ or 0 error, status 0 means network error
                if ((status >= 500 || status == 0) && ((error.config as RequestConfig)?.retryCount ?? 0) > 0) {
                    return await RequestClient.retryRequest(error)
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

    private static async retryAfterRefresh(config: RequestConfig) {
        if (this.refreshTokenPromise == null) {
            this.refreshTokenPromise = new Promise(async (resolve, reject) => {
                try {
                    const refreshToken = await getRefreshToken()

                    // try to refresh token, and if it succeeds set them into async storage and retry request
                    if (refreshToken != null) {
                        const refreshTokenResult = await this.post<LoginResponse>(refreshTokenRoute, null,
                            { headers: { "Refresh-Token": refreshToken } }
                        )

                        if (refreshTokenResult.status == 200 && refreshTokenResult.data?.data?.token != null) {
                            await setUserToken(refreshTokenResult.data.data.token)
                            await setRefreshToken(refreshTokenResult.data.data.refreshToken)

                            const originalRequest: RequestConfig = { ...config, isRetryAfterRefresh: true }
                            return resolve(await (await RequestClient.getInstance())(originalRequest))
                        }
                    }
                } catch (err) {
                    return reject(HTTP403)
                }
            })

            return this.refreshTokenPromise
        } else if (this.refreshTokenPromise) {
            // another request is already trying to refresh the user token, wait for it
            await this.refreshTokenPromise
            this.refreshTokenPromise = null

            const originalRequest = { ...config, retry: true }
            return await (await this.getInstance())(originalRequest)
        }

        return Promise.reject()
    }

    private static async retryRequest(error: AxiosError) {
        await delay(500)
        devlog("retries left:", ((error.config as RequestConfig)?.retryCount ?? 1) - 1, "for", error?.config?.url)
        const originalRequest: RequestConfig = {
            ...error.config,
            retryCount: ((error.config as RequestConfig)?.retryCount ?? 1) - 1
        }
        return await (await this.getInstance())(originalRequest)
    }

    /**
    * For Hot Reload
    */
    private static async refreshInstace() {
        try {
            const isDev = await getIsDev()
            this.createInstance(isDev)
        } catch (err) {
            this.createInstance(false)
        }
    }
}

export const initializeRequestClient = async (environment: AppEnvironment) => {
    const isDev = environment == AppEnvironment.Dev
    await setIsDev(isDev)
    RequestClient.createInstance(isDev)
}

export default RequestClient
