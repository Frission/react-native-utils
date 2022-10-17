import { ActionReducerMapBuilder, AsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootStateOrAny, shallowEqual } from "react-redux";
import devlog from "./devlog";

export interface Resource<T> {
    data: T | null,
    /** null means the resource has never been fetched */
    loading: boolean | null,
    error?: string | null,
}

export interface TaggedResource<T> extends Resource<T> {
    tag?: string | Object
}

export interface TaggedResourceReturnType {
    data: any,
    tag: string | Object,
}

export function loadingResource<T>(data: T | null = null) {
    const resource: Resource<T> = {
        data: data,
        loading: true,
        error: null,
    };

    return resource;
}

export function successResource<T>(data: T | null) {
    const resource: Resource<T> = {
        data: data,
        loading: false,
        error: null,
    };

    return resource;
}

export function errorResource<T>(error: any, data: T | null = null) {
    devlog("promise rejected, error in resource")

    if (error?.data)
        devlog(error.data)
    else
        devlog(error)

    const resource: Resource<T> = {
        data: data,
        loading: false,
        error: error,
    };

    return resource;
}

export function emptyResource<T>() {
    const resource: Resource<T> = {
        data: null,
        loading: null,
        error: null,
    };

    return resource;
}

export function resourceIsLoaded<T>(resource: Resource<T>): boolean {
    return (resource.data != null || resource.error != null) && resource.loading == false
}

export function resourceIsLoadedWithoutError<T>(resource: Resource<T>): boolean {
    return resource.data != null && resource.error == null && resource.loading == false
}

export function resourceNeedsToBeLoaded<T>(resource: Resource<T>): boolean {
    return resource.data == null && resource.loading != true
}

type IndexableState = object & { [K in keyof any]: any[K] }

/**
 * Creates pending, fuilfilled and rejected actions for async thunks that update Resource<T> type objects
 * 
 * @param builder The builder you get from extraReducers' parameter
 * @param asyncThunk The function created from createAsyncThunk
 * @param propKey The name of the Resource<T> prop inside the state that you want updated
 */
export const createResourceThunkReducers = <T extends IndexableState>(builder: ActionReducerMapBuilder<T>,
    asyncThunk: AsyncThunk<any, any, any>,
    propKey: keyof T) => {

    builder.addCase(asyncThunk.pending, (state) => {
        const resource: Resource<unknown> = state[propKey]

        return { ...state, [propKey]: loadingResource(resource.data ?? null) }
    })

    builder.addCase(asyncThunk.fulfilled, (state, action: PayloadAction<any>) => {
        return { ...state, [propKey]: successResource(action.payload) }
    })

    builder.addCase(asyncThunk.rejected, (state, action) => {
        const resource: Resource<unknown> = state[propKey]

        return { ...state, [propKey]: errorResource(action.payload, resource?.data ?? null) }
    })
}

/**
 * Creates pending, fuilfilled and rejected actions for async thunks that update TaggedResource<T> type objects,
 * the tag will be the arguments provided to the async thunk
 * 
 * @param builder The builder you get from extraReducers' parameter
 * @param asyncThunk The function created from createAsyncThunk
 * @param propKey The name of the TaggedResource<T> prop inside the state that you want updated
 * @param tagKey optional, if you are receiving thunk arguments as an object, you can select a value to use as a tag by providing it's name here
 */
export const createTaggedResourceThunkReducers = <T extends IndexableState>(builder: ActionReducerMapBuilder<T>,
    asyncThunk: AsyncThunk<TaggedResourceReturnType, any, any>,
    propKey: keyof T) => {

    builder.addCase(asyncThunk.pending, (state: RootStateOrAny, action) => {
        const resource: TaggedResource<unknown> = state[propKey]
        const tag = extractTagFromPlainType(action.meta.arg)

        return { ...state, [propKey]: { ...loadingResource(resource.data ?? null), tag: tag ?? resource.tag } }
    })

    builder.addCase(asyncThunk.fulfilled, (state: RootStateOrAny, action: PayloadAction<TaggedResourceReturnType>) => {

        return { ...state, [propKey]: { ...successResource(action.payload.data), tag: action.payload.tag } }
    })

    builder.addCase(asyncThunk.rejected, (state: RootStateOrAny, action) => {
        const resource: TaggedResource<unknown> = state[propKey]

        return { ...state, [propKey]: errorResource(action.payload, resource?.data ?? null) }
    })
}

type PlainTag<T> =
    T extends string | number | boolean | null | undefined ? T :
    T extends object ? { [K in keyof T]: PlainTag<T[K]> } :
    never;

/**
 * The tag has to be provided rom the thunk arguments
 * Checks if the previous tag is the same as the current one,
 * if they are the same, the async thunk will not be executed
 * 
 * @param prevTag the previous that, can be a plain js object or a primitive
 * @param currentTag the current tag, can be a plain js object or a primitive
 */
export const tagCondition = <T, R>(prevTag: PlainTag<T>, currentTag: PlainTag<R>): boolean | undefined => {
    const tagToCheck = extractTagFromPlainType(currentTag)

    if (prevTag && tagToCheck)
        return shallowEqual(prevTag, tagToCheck) == false
    else
        return true
}

const extractTagFromPlainType = <T>(tag: PlainTag<T>): Object | undefined => {
    let extractedTag

    if(tag == null)
        return undefined

    if (typeof tag === "object")
        extractedTag = tag
    else
        extractedTag = { tag: tag.toString() }

    return extractedTag
}