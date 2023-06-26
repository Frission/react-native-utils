
export enum ApiRoutes {
    Base = "",
    Config = "config",
}


/**
 * Maps keys to endpoint values, 
 * e.x. createEndpoints(ApiRoutes.Me, { base: "", endpoint: "string" }) will return { base: "me", endpoint: "me/string" }
 * @param route the base route for the endpoints, please use "/" to make a request to the base endpoint (without query parameters)
 * @param endpoints endpoint names
 * @returns a mapping of string keys to endpoint values
 */
export const createEndpoints = <T extends {}>(route: ApiRoutes, endpoints: T): T => {
    return createEndpointsWithBase(route, endpoints)
}

export const createEndpointsWithBase = <T extends {}>(baseUrl: string, endpoints: T): T => {
    const combined: any = {}

    Object.entries(endpoints).forEach(([name, endpoint]) => {
        if (endpoint == "" || endpoint == null)
            combined[name] = baseUrl
        else if (endpoint === "/")
            combined[name] = baseUrl + endpoint
        else if (typeof endpoint === "function") {
            const getEndpoint = (...args: any) => { return baseUrl + "/" + endpoint(args) }
            combined[name] = getEndpoint
        } else
            combined[name] = baseUrl + "/" + endpoint
    })

    return combined
}
