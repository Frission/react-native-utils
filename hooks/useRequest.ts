import { isRejectedWithValue } from "@reduxjs/toolkit"
import React from "react"
import { useDispatch } from "react-redux"
import { AuthError401, AuthError404, AuthError412 } from "../core/Constants"
import { userActions } from "../store/slices/UserSlice"
import { emptyResource, errorResource, loadingResource, Resource, successResource } from "./reduxUtil"

export interface RequestState<T> extends Resource<T> { }

/**
 * Create a Promise that does not update view state when component is unmounted
 * @param request the request function which returns a promise
 * @param getErrorString optional function to replace the error string when the request fails
 * @returns a function for starting the request, and the state of the request
 */
export const useRequest = <Response = void, Args extends Array<any> = Parameters<any>>
    (   // hook arguments
        request: (...args: Args) => Promise<Response>,
        getErrorString?: (err: any) => string
    )
    :
    [   // return parameters
        startRequest: (...args: Parameters<typeof request>) => void,
        requestState: RequestState<Response>,
        resetRequestState: () => void,
    ] => {

    const dispatch = useDispatch()

    const [requestState, setRequestState] = React.useState<Resource<Response>>(emptyResource())
    const [args, setArgs] = React.useState<Parameters<typeof request> | undefined>(undefined)

    /** Start the request, which will reset request state to loading, and send it */
    const startRequest = (...requestArgs: any) => {
        setRequestState(loadingResource())
        setArgs(requestArgs)
    }

    React.useEffect(() => {
        /** do not update any states if the component is unmounted */
        let isMounted = true

        if (args && requestInProgress(requestState)) {

            request(...args)
                .then(value => {
                    if (isMounted) {
                        setRequestState(successResource(value))
                    }
                })
                .catch(err => {
                    if (isMounted) {
                        if (getErrorString)
                            setRequestState(errorResource(getErrorString(err)))
                        else
                            setRequestState(errorResource(err))
                    }

                    if (err == AuthError401)
                        dispatch(userActions.setAuthError(AuthError401))
                    else if (err == AuthError404)
                        dispatch(userActions.setAuthError(AuthError404))
                    else if (err == AuthError412)
                        dispatch(userActions.setAuthError(AuthError412))
                })
        }

        return () => {
            isMounted = false
        }
    }, [requestState.loading, args])

    const resetRequestState = () => {
        setRequestState(emptyResource())
    }

    return [startRequest, requestState, resetRequestState]
}

export const requestSent = (requestState: Resource<unknown>): boolean => {
    return requestState.loading != null
}

export const requestInProgress = (requestState: Resource<unknown>): boolean => {
    return requestState.loading === true
}

export const requestSuccessful = (requestState: Resource<unknown>): boolean => {
    return requestState.loading === false && requestState.error == null
}

export const requestFailed = (requestState: Resource<unknown>): boolean => {
    return requestState.loading === false && requestState.error != null
}
