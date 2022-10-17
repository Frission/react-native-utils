import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { theme } from "../../styles/Theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"

/**
 * Uses MaterialCommunityIcons as default
 * can provide { useIonicons } parameter to use Ionicons instead
 */
const ThemeIcon = ({ name: iconName,
    size = 24,
    color = "white",
    useIonicons = false,
    visible = true,
    style,
    onPress,
}: ThemeIconProps) => {

    if (!visible)
        return null

    return (
        useIonicons ?
            <Ionicons
                name={iconName}
                size={size}
                color={color}
                style={style}
                onPress={onPress}
            />
            :
            <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
                style={style}
                onPress={onPress}
            />
    )
}

interface ThemeIconProps {
    name: string,
    size?: number,
    color?: string,
    useIonicons?: boolean,
    visible?: boolean,
    style?: StyleProp<TextStyle>,
    onPress?: () => void | undefined,
}

export default ThemeIcon;