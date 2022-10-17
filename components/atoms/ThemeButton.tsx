import React from "react";
import { StyleSheet, StyleProp, ViewStyle, TextStyle, Platform, TouchableOpacity } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { theme } from "../../styles/Theme";
import ThemeText from "./ThemeText";

const ThemeButton = ({ text, onPress, disabled = false, style, textStyle, textOnly, disableWithoutDim, lightRipple, useTouchableOpacity }: ThemeButtonProps) => {

    const backgroundStyle: StyleProp<ViewStyle> = textOnly ?
        { backgroundColor: "transparent" } :
        { backgroundColor: theme.colors.secondary }

    let disabledOpacity = disableWithoutDim ? 1 : theme.disabledOpacity

    if (useTouchableOpacity || (Platform.OS === "android" && Platform.Version < 28))
        return (
            <TouchableOpacity
                disabled={disabled}
                onPress={onPress}
                style={[styles.buttonStyle, backgroundStyle, style, { opacity: disabled ? disabledOpacity : 1 }]}
                activeOpacity={theme.activeOpacity}
            >
                <ThemeText style={[textOnly ? styles.textOnlyStyle : styles.textStyle, textStyle]}>
                    {text}
                </ThemeText>
            </TouchableOpacity>
        );
    else
        return (
            <TouchableRipple
                disabled={disabled}
                onPress={onPress}
                style={[styles.buttonStyle, backgroundStyle, style, { opacity: disabled ? disabledOpacity : 1 }]}
                borderless
                rippleColor={lightRipple ? "rgba(255, 255, 255, 0.2)" : undefined}
            >
                <ThemeText style={[textOnly ? styles.textOnlyStyle : styles.textStyle, textStyle]}>
                    {text}
                </ThemeText>
            </TouchableRipple>
        );
};

const styles = StyleSheet.create({
    buttonStyle: {
        borderRadius: theme.roundness,
        padding: 10,
        alignItems: "center",
    },
    textStyle: {
        color: theme.colors.textWhite,
        textAlign: "center",
        paddingHorizontal: 5,
    },
    textOnlyStyle: {
        color: theme.colors.textSecondary,
        textAlign: "center",
        paddingHorizontal: 5,
        textDecorationLine: "underline",
    }
});

interface ThemeButtonProps {
    text: string | React.ReactNode,
    onPress: (() => void) | undefined,
    disabled?: boolean,
    disableWithoutDim?: boolean,
    textOnly?: boolean,
    lightRipple?: boolean,
    useTouchableOpacity?: boolean,
    style?: StyleProp<ViewStyle>,
    textStyle?: StyleProp<TextStyle>,
}

export default ThemeButton;