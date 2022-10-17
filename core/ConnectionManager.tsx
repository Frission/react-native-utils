import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken, CancelTokenSource } from "axios";
import { Platform } from "react-native";
import devlog from "../util/devlog";
import { AuthError401, AuthError404, AuthError412, DEV_BASE_URL, PROD_BASE_URL } from "./Constants";
import MApiResponse from "./model/util/MApiResponse";

export type ApiResponse<T> = T extends {} ? AxiosResponse<MApiResponse & T> : AxiosResponse<MApiResponse & unknown>
export type FileUpload = { uri: string, name: string, type: string }

class ConnectionManager {

    public static logRequests = false

    private static instance: AxiosInstance | null = null
    private static cancelTokenSources: Map<string, CancelTokenSource> = new Map<string, CancelTokenSource>()

    private static sessionID: string | null = null

    private constructor() { }

    public static getInstance() {
        if (this.instance === null)
            this.createInstance(false)

        return this.instance
    }

    public static async get<T>(url: string, config?: AxiosRequestConfig | undefined): Promise<ApiResponse<T> | undefined> {
        if (this.instance === null)
            await this.refreshInstace()

        devlog("get request: " + url)

        return await this.instance?.get(url, config)
    }

    public static async getParams<T>(url: string, params?: any, config?: AxiosRequestConfig | undefined): Promise<ApiResponse<T> | undefined> {
        if (this.instance === null)
            await this.refreshInstace()

        devlog("get request: " + url)

        return await this.instance?.get(url, { ...config, params })
    }

    public static async getBase<T>(baseUrl: string, params?: any, config?: AxiosRequestConfig | undefined): Promise<ApiResponse<T> | undefined> {
        try {
            if (!config)
                config = { headers: {} }
            else
                config = { ...config, headers: { ...config?.headers } }

            if (this.sessionID == null)
                this.sessionID = await AsyncStorage.getItem("sid")

            if (this.sessionID && config.headers) {
                if (Platform.OS == "ios")
                    config.headers["Cookies"] = `sid=${this.sessionID};`
                else
                    config.headers["Cookie"] = `sid=${this.sessionID};`
            }

            devlog("get request: " + baseUrl)

            return await axios.get(baseUrl, { ...config, params })
        } catch (err) {
            return this.handleResponseError(err)
        }
    }

    public static async post<T>(url: string, config?: AxiosRequestConfig | undefined): Promise<ApiResponse<T> | undefined> {
        if (this.instance === null)
            await this.refreshInstace()

        devlog("post request: " + url)

        return await this.instance?.post(url, null, config)
    }

    public static async postParams<T>(url: string, params?: any, config?: AxiosRequestConfig | undefined): Promise<ApiResponse<T> | undefined> {
        if (this.instance === null)
            await this.refreshInstace()

        devlog("post request: " + url)

        return await this.instance?.post(url, null, { ...config, params })
    }

    public static async postData<T>(url: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<ApiResponse<T> | undefined> {
        if (this.instance === null)
            await this.refreshInstace()

        devlog("post request: " + url)

        if (!config)
            config = { headers: {} }
        else
            config = { ...config, headers: { ...config?.headers } }

        if (config.headers && !config.headers?.["Content-Type"]) {
            config.headers["Content-Type"] = "application/x-www-form-urlencoded"
        }

        if (typeof data === "object") {
            return await this.instance?.post(url, this.createFormData(data), config)
        } else {
            return await this.instance?.post(url, data, config)
        }
    }
    

    public static async postBase<T>(baseUrl: string, params?: any, config?: AxiosRequestConfig | undefined): Promise<ApiResponse<T> | undefined> {
        try {
            if (!config)
                config = { headers: {} }
            else
                config = { ...config, headers: { ...config?.headers } }

            if (this.sessionID == null)
                this.sessionID = await AsyncStorage.getItem("sid")

            if (this.sessionID && config.headers) {
                config.headers["Cookie"] = `sid=${this.sessionID};`
                if (Platform.OS == "ios")
                    config.headers["Cookies"] = `sid=${this.sessionID};`
            }

            if (config.headers && !config.headers?.["Content-Type"]) {
                config.headers["Content-Type"] = "application/x-www-form-urlencoded"
            }

            devlog("post request: " + baseUrl)

            return await axios.post(baseUrl, null, { ...config, params })
        } catch (err) {
            return this.handleResponseError(err)
        }
    }

    public static async postBaseData<T>(baseUrl: string, data?: any, config?: AxiosRequestConfig | undefined): Promise<ApiResponse<T> | undefined> {
        try {
            if (!config)
                config = { headers: {} }
            else
                config = { ...config, headers: { ...config?.headers } }

            if (this.sessionID == null)
                this.sessionID = await AsyncStorage.getItem("sid")

            if (this.sessionID && config.headers) {
                config.headers["Cookie"] = `sid=${this.sessionID};`
                if (Platform.OS == "ios")
                    config.headers["Cookies"] = `sid=${this.sessionID};`
            }

            if (config.headers && !config.headers["Content-Type"]) {
                config.headers["Content-Type"] = "application/x-www-form-urlencoded"
            }

            devlog("post request: " + baseUrl)

            if (typeof data === "object") {
                return await axios.post(baseUrl, this.createFormData(data), config)
            } else {
                return await axios.post(baseUrl, data, config)
            }
        } catch (err) {
            return this.handleResponseError(err)
        }
    }

    public static async uploadFile(url: string, file?: FileUpload, config?: AxiosRequestConfig | undefined): Promise<void> {
        try {     
            let formData = new FormData()
            formData.append("file", file)

            return await this.instance?.post(url, formData, config)
        } catch (err) {
            return this.handleResponseError(err)
        }
    }

    public static getBaseURL(): string {

        if (this.instance === null || !this.instance.defaults.baseURL)
            return PROD_BASE_URL
        else
            return this.instance.defaults.baseURL
    }

    public static createInstance(isBeta: boolean) {
        if (this.instance !== null)
            return

        if (isBeta) {
            devlog("creating beta instance for axios");
            this.instance = axios.create({
                baseURL: DEV_BASE_URL,
                timeout: 40000,
            })
        }
        else {
            devlog("creating prod instance for axios");
            this.instance = axios.create({
                baseURL: PROD_BASE_URL,
                timeout: 40000,
            })
        }

        this.instance.interceptors.request.use(
            // make request
            async (config) => {
                if (this.sessionID == null)
                    this.sessionID = await AsyncStorage.getItem("sid")

                if (config.method === "POST" && config.headers) {
                    config.headers["Content-Type"] = "application/x-www-form-urlencoded"
                }

                if (this.sessionID && config.headers) {
                    config.headers.Cookie = `sid=${this.sessionID};`
                    if (Platform.OS == "ios")
                        config.headers.Cookies = `sid=${this.sessionID};`
                }

                return config
            },
            this.handleResponseError
        );

        this.instance.interceptors.response.use(
            (response) => {
                const operationResponse: MApiResponse = response.data

                // database operation failed
                if (operationResponse.success === false)
                    devlog("operation status: " + operationResponse.operationCode + " (failed)")

                devlog("operationMessage: " + operationResponse.operationMessage)

                if (this.logRequests)
                    devlog(response.data)
                else if (response.status !== 200 && response.status != 201 && response.status !== 202) {
                    // request failed
                    devlog(response.data)
                }

                return response
            },
            this.handleResponseError
        );
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
        devlog(`Requests tagged \"${tag}\" are cancelled.`)
        this.cancelTokenSources.get(tag)?.cancel(`Requests tagged ${tag} are cancelled.`)
        this.createCancelToken(tag)
    }

    public static cancelRequestsByTagAndRemove(tag: string) {
        devlog(`Requests tagged \"${tag}\" are cancelled.`)
        this.cancelTokenSources.get(tag)?.cancel(`Requests tagged ${tag} are cancelled.`)
        this.removeCancelToken(tag)
    }

    public static preventRequestsByTag(tag: string) {
        if (this.cancelTokenSources.has(tag)) {
            devlog(`Requests tagged \"${tag}\" will be prevented from sending until a new token creation, or removal.`)
            this.cancelTokenSources.get(tag)?.cancel(`Requests tagged \"${tag}\" will be prevented from sending.`)
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

    private static handleResponseError(error: any) {
        if (error.response == null) {
            devlog("request error: no response. request cancelled?")
        } else {
            if (error.response.data) {
                devlog("request error: " + error?.config?.url)
                devlog(error.response.data)
            }

            if (error.response.status) {
                switch (error.response.status) {
                    case 401:
                        return Promise.reject(AuthError401)
                    case 412:
                        return Promise.reject(AuthError412)
                    case 404:
                        return Promise.reject(AuthError404)
                    default:
                        devlog("request error: " + error?.config?.url)
                        return Promise.reject(error.response)
                }
            }
        }
    }

    private static createFormData<T extends { [key: string | number]: any }>(data: T): FormData {
        let form = new FormData()

        for (let key of Object.keys(data)) {
            const property = data[key]

            if (typeof property === "object")
                form.append(key, JSON.stringify(data[key]))
            else
                form.append(key, data[key])
        }

        return form
    }

    /**
    * For Hot Reload
    */
    private static async refreshInstace() {
        try {
            const isBeta = await AsyncStorage.getItem("isBeta", () => false)
            this.createInstance(isBeta === "true")
        } catch (err) {
            this.createInstance(false)
        }
    }
}

export default ConnectionManager
