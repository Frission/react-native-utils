import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { theme } from "../../../styles/Theme";
import ThemeProgressBar from "../../atoms/ThemeProgressBar";
import ThemeText from "../../atoms/ThemeText";

const ProgressBarWithText = (props: ProgressBarWithTextProps) => {

    return (
        <View style={styles.container}>
            <ThemeProgressBar {...props} style={[styles.barStyle, props.barStyle, props.width ? { width: props.width } : undefined]} />
            <ThemeText style={styles.textStyle}>{`%${props.progress}`}</ThemeText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    barStyle: {
        flex: 1,
    },
    textStyle: {
        color: theme.colors.accent,
        fontSize: 11,
        marginLeft: 6,
    }
})

interface ProgressBarWithTextProps {
    /** Needs to be between 0 and 100 */
    progress: number,
    height?: number,
    width?: number | string,
    showText?: boolean,
    indeterminate?: boolean,
    barStyle?: StyleProp<ViewStyle>,
    containerStyle?: StyleProp<ViewStyle>
}

export default ProgressBarWithText