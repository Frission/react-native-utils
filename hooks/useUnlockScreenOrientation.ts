import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Platform } from "react-native"
import Orientation from "react-native-orientation"

export default () => {
    
    const navigation = useNavigation()

    React.useEffect(() => {
        const unsubFocus = navigation.addListener("focus", () => {
            setTimeout(Orientation.unlockAllOrientations, Platform.select({ ios: 400, default: 200 }))
        })
        const unsubBlur = navigation.addListener("blur", () => {
            setTimeout(Orientation.lockToPortrait, Platform.select({ ios: 500, default: 300 }))
        })

        return () => {
            unsubFocus()
            unsubBlur()
        }
    }, [])
}