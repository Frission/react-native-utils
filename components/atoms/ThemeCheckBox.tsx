import React, { Dispatch, SetStateAction } from "react"
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Checkbox } from "react-native-paper"
import { theme } from "../../styles/Theme"
import ThemeText from "./ThemeText"

const ThemeCheckbox = ({
    text,
    textStyle,
    containerStyle,
    checked,
    disabled,
    onPressed,
    onTextPressed,
    color = "white",
    uncheckedColor = theme.colors.primary
}: ThemeCheckboxProps) => {

    let status: "checked" | "unchecked" | "indeterminate" = checked ? "checked" : "unchecked"

    const onPress = () => {
        onPressed(!checked)
    }

    return <View style={[styles.container, containerStyle]}>
        {
            text != null &&
            <ThemeText style={[styles.text, textStyle]} onPress={onTextPressed}>
                {text}
            </ThemeText>
        }
        <Checkbox
            disabled={disabled}
            status={status}
            onPress={onPress}
            color={color}
            uncheckedColor={uncheckedColor}
        />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "flex-start"
    },
    text: {
        flex: 1,
        color: "white",
        paddingTop: 5,
    }
})

interface ThemeCheckboxProps {
    text?: string | React.ReactNode,
    disabled?: boolean,
    checked: boolean,
    onPressed: Dispatch<SetStateAction<boolean>>
    onTextPressed?: () => void,
    containerStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    uncheckedColor?: string,
    color?: string
}

export default ThemeCheckbox
