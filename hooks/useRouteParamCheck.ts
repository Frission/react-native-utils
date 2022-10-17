import React from "react"
import devlog, { devlogWarn } from "../../util/devlog"

export default (params: Object, expectedParams: Array<string>, optionalParams?: Array<string>) => {
    if (__DEV__) {
        React.useEffect(() => {
            const availableParams = Object.keys(params)

            expectedParams.forEach(param => {
                if (!availableParams.includes(param) && (optionalParams?.includes(param) ?? false) === false) 
                    devlogWarn(`${param} route param is missing`)
                else if (optionalParams?.includes(param))
                    devlog(`${param} route param was not provided in route`)
            })
        }, [])
    }
}