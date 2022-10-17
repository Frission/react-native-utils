import React from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import { theme } from "../../styles/Theme";
import ThemeIcon from "./ThemeIcon";

/** Positioned absolutely to the top right of the view */
const ThemeTopRightCheckIcon = ({ style, color, backgroundColor }: ThemeTopRightCheckIconProps) => {
    return (
        <ThemeIcon
            name={"check-circle-outline"}
            size={24}
            color={color ? color : theme.colors.correct}
            style={[styles.checkIconStyle, { backgroundColor: backgroundColor ? backgroundColor : "white" }, style]}
        />
    )
}

const styles = StyleSheet.create({
    checkIconStyle: {
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 2,
        right: -12,
        top: -12,
        overflow: "hidden",
    },
})

interface ThemeTopRightCheckIconProps {
    style?: StyleProp<ViewStyle>,
    backgroundColor?: string,
    color?: string,
}

export default ThemeTopRightCheckIcon