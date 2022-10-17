
import useDispatch from "@reduxjs/toolkit"
import { useMockSelector, sliceSelectors, sliceActions } from "../redux/ExampleSlice"
import { resourceIsLoaded, resourceIsLoadedWithoutError, resourceNeedsToBeLoaded } from "../util/reduxUtil"
import ResourceView from "../components/atoms/ResourceView"
import LoadingCard from "../components/molecules/LoadingCard"
import ErrorCard from "../components/molecules/ErrorCard"
import { Text } from "react-native"

const MyComponent = () => {

    const dispatch = useDispatch()

    const exampleData = useMockSelector(sliceSelectors.selectData)

    // you can check if it is loading
    if(exampleData.loading) {
        /* ... */
    }

    // you can check if resource is loaded
    if(resourceIsLoaded(exampleData)) {
        /* ... */
    }

    if(resourceIsLoadedWithoutError(exampleData)) {
        /* ... */
    }

    // example data fetch

    React.useEffect(() => {
        if(resourceNeedsToBeLoaded(exampleData))
            dispatch(sliceActions.fetchData)
    }, [])

    return (
        <ResourceView 
            resourceState={exampleData}
            successComponent={
                <Text>{exampleData.data}</Text>
            }
            loadingComponent={
                <LoadingCard height={100} />
            }
            errorComponent={
                <ErrorCard defaultStyle text={exampleData.error ?? "An error occurred."} />
            }
        />
    )
}


// Mock

class React {
    static useEffect(func: () => void, dep: []) {}
}