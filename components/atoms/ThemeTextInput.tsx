import React from "react";
import { TextInputProps } from "react-native";
import { StyleProp, TextInput, TextStyle } from "react-native";
import { StyleSheet } from "react-native";
import { theme } from "../../styles/Theme";

const ThemeTextInput = (props: ThemeTextInputProps) => {
    return (
        <TextInput
            selectionColor={theme.colors.primary}
            autoCorrect={false}
            autoCapitalize="none"
            {...props}
            style={[styles.style, props.style]}
        />
    )
}

const styles = StyleSheet.create({
    style: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.roundness,
        color: theme.colors.textPrimary,
        paddingHorizontal: 10,
    }
})

interface ThemeTextInputProps extends TextInputProps {}

export default ThemeTextInput