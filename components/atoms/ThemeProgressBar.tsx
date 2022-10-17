import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle, LayoutChangeEvent } from "react-native";
import { theme } from "../../styles/Theme";

const ThemeProgressBar = ({ progress, height = 8, barColor, style, onLayout }: ThemeProgressBarProps) => {

    return (
        <View
            style={[styles.progressBarStyle, { height: height, width: "100%" }, style]}
            onLayout={onLayout}
        >
            <View style={{ flex: 1, width: `${progress}%`, backgroundColor: barColor ?? theme.colors.progressBar, borderRadius: 2.5}} />
        </View>
    )
}

const styles = StyleSheet.create({
    progressBarStyle: {
        backgroundColor: "white",
        height: 8,
        borderRadius: 5,
        overflow: "hidden",
    }
})

interface ThemeProgressBarProps {
    /** Needs to be between 0 and 100 */
    progress: number,
    height?: number,
    barColor?: string,
    style?: StyleProp<ViewStyle>,
    onLayout?(event: LayoutChangeEvent): void,
}

export default ThemeProgressBar