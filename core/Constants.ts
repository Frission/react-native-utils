export const DEV_BASE_URL = 'https://dev.url.com/';
export const PROD_BASE_URL = 'https://prod.url.com/';

export interface HTTPError {
	title: string,
	message: string,
	error: string,
	extras?: Array<string>,
}

export const HTTPError401: HTTPError = { title: "Notice", message: "Your login session has timed out.", error: "401" }
export const HTTPError412: HTTPError = { title: "Notice", message: "Your account has been logged on through another device.", error: "412" }
export const HTTPError404: HTTPError = { title: "Error", message: "An unexpected error has occurred.", error: "404" }
