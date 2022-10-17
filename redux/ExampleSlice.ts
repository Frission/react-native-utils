import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CancelToken } from "axios";
import RequestClient from "../core/RequestClient";
import { createResourceThunkReducers, emptyResource, Resource, resourceIsLoaded, resourceIsLoadedWithoutError } from "../util/reduxUtil";

const CANCEL_TOKEN_TAG = "CancelTokenTag"

export interface SliceState {
    data: Resource<ExampleData>,
    cancelToken: CancelToken,
}

const initialState: SliceState = {
    data: emptyResource(),
    cancelToken: RequestClient.createCancelToken(CANCEL_TOKEN_TAG)
}


const fetchData = createAsyncThunk(
    "slice/fetchData",
    async ({ param }: { param: string | null }, { rejectWithValue }) => {
        try {
            return await getExampleData(param, RequestClient.getCancelToken(CANCEL_TOKEN_TAG))
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const slice = createSlice({
    name: "slice",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        createResourceThunkReducers(builder, fetchData, "data")
    }
})

export const sliceActions = {
    ...slice.actions,
    fetchData
}

export const sliceSelectors = {
    selectData: (state: RootState): Resource<ExampleData> => state.slice.data,
}

export default slice.reducer

// End of file

// --- EXAMPLE USAGE ---

//#region Mock Data and State

interface RootState {
    slice: SliceState
}

type ExampleData = string

const getExampleData = (param: string | null, cancelToken: CancelToken): Promise<ExampleData> => {
    // normally you would use the cancel token with the axios request to be able to cancel it later
    return Promise.resolve("data" + (param ?? " no param "))
}

export const useMockSelector = <T>(selector: (state: RootState) => T) => selector({ slice: initialState })

//#endregion