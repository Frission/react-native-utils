import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { BackHandler } from "react-native"
import { handleBackAction } from "../../navigation/MainNavigation"
import devlog from "../../util/devlog"

/**
 * Handles the Android Back button
 * 
 * This back handler prevents the Activity from closing if there is no previous screen, and navigates out of React properly
 * @param navigation navigation prop
 * @param isFocused optional, is isFocused is given, will unsubscribe when isFocused is false
 */
export default (navigation: NavigationProp<any, any, any>, isFocused?: boolean, debugScreenName?: string) => {
    const onBackPress = React.useCallback(() => handleBackAction(navigation, isFocused), [isFocused])

    // handle back button on android
    React.useEffect(() => {
        if (isFocused !== false) {
            if (debugScreenName)
                devlog(debugScreenName, "subscribed androidBackHandler")

            BackHandler.addEventListener("hardwareBackPress", onBackPress)
        }

        return () => {
            if (isFocused !== false) {
                if (debugScreenName)
                    devlog(debugScreenName, "unsubscribed androidBackHandler")

                BackHandler.removeEventListener("hardwareBackPress", onBackPress)
            }
        }
    }, [isFocused, onBackPress])
}

export const useCustomAndroidBackHandler = (navigation: NavigationProp<any, any, any>, backHandler: (navigation: NavigationProp<any, any, any>) => boolean) => {
    const onBackPress = React.useCallback(() => backHandler(navigation), [])

    // handle back button on android
    React.useEffect(() => {
        const unsubFocus = navigation.addListener("focus", () => {
            BackHandler.addEventListener("hardwareBackPress", onBackPress)
        })

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", onBackPress)
            unsubFocus()
        }
    }, [])
}